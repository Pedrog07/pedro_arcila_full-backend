import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AwsProvider,
  ExceptionsProvider,
  AuthorizationProvider,
  UnsplashProvider,
} from 'providers';
import { User, File } from 'entities';
import { RenameFileDTO, SearchExternalFilesDTO } from './types';

@Injectable()
export class FilesProvider {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(File) private fileRepository: Repository<File>,
    private readonly awsProvider: AwsProvider,
    private readonly exceptionsProvider: ExceptionsProvider,
    private readonly authorizationProvider: AuthorizationProvider,
    private readonly unsplashProvider: UnsplashProvider,
  ) {}

  async upload(file: any, authToken: string) {
    const id = this.authorizationProvider.validateToken(authToken);

    if (!file) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Missing file',
      );
    }

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.NOT_FOUND,
        'User not found',
      );
    }

    const { buffer, originalname, mimetype } = file;

    const [Key, fileName] = this.awsProvider.getFileKey(user.id, originalname);

    const { Location } = await this.awsProvider.s3
      .upload({ Bucket: this.awsProvider.bucket, Body: buffer, Key })
      .promise();

    const newFile = new File();

    newFile.fileType = mimetype;
    newFile.user = user;
    newFile.fileName = fileName;
    newFile.fileUrl = Location;

    await this.fileRepository.save(newFile);

    return { message: 'File uploaded successfully' };
  }

  async getUserFiles(authToken: string) {
    const id = this.authorizationProvider.validateToken(authToken);

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.NOT_FOUND,
        'User not found',
      );
    }

    const files = await this.fileRepository
      .createQueryBuilder('file')
      .where('file.userId = :id', { id })
      .getMany();

    return {
      files:
        files?.map((file: File) => {
          const { fileName, fileUrl, id } = file;
          return { fileName, fileUrl, id };
        }) || [],
    };
  }

  async renameFile(data: RenameFileDTO, authToken: string) {
    const id = this.authorizationProvider.validateToken(authToken);
    const { fileId, newName } = data;

    if (!fileId || !newName) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Missing some fields',
      );
    }

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.NOT_FOUND,
        'User not found',
      );
    }

    const file = await this.fileRepository
      .createQueryBuilder('file')
      .where('file.userId = :id', { id })
      .andWhere('file.id = :fileId', { fileId })
      .getOne();

    if (!file) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.NOT_FOUND,
        'File not found',
      );
    }

    const [currentKey, extension] = this.awsProvider.getCurrentFileKey(
      id,
      file.fileName,
      true,
    );
    const [Key, fileName] = this.awsProvider.getFileKey(
      id,
      `${newName}${extension}`,
    );

    await this.awsProvider.s3
      .copyObject({
        Bucket: this.awsProvider.bucket,
        CopySource: currentKey,
        Key,
      })
      .promise();

    file.fileName = fileName;
    file.fileUrl = this.awsProvider.buildNewS3Url(file.fileUrl, Key);

    await this.fileRepository.save(file);

    return { message: 'File name successfully changed' };
  }

  async getFile(fileId: string, authToken: string) {
    const id = this.authorizationProvider.validateToken(authToken);

    if (!fileId) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Missing file id',
      );
    }

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.NOT_FOUND,
        'User not found',
      );
    }

    const file = await this.fileRepository
      .createQueryBuilder('file')
      .where('file.userId = :id', { id })
      .andWhere('file.id = :fileId', { fileId })
      .getOne();

    if (!file) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.NOT_FOUND,
        'File not found',
      );
    }

    const [Key] = this.awsProvider.getCurrentFileKey(id, file.fileName);

    const { Body } = await this.awsProvider.s3
      .getObject({
        Bucket: this.awsProvider.bucket,
        Key,
      })
      .promise();
    return { buffer: Body, mimeType: file.fileType, fileName: file.fileName };
  }

  async searchExternalFiles(data: SearchExternalFilesDTO, authToken: string) {
    const { page = 1, perPage = 10, search = '' } = data;

    const result = await this.unsplashProvider.searchPhotos(
      search,
      page,
      perPage,
    );
    return result;
  }
}
