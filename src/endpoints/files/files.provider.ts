import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AwsProvider,
  ExceptionsProvider,
  AuthorizationProvider,
} from 'providers';
import { User, File } from 'entities';

@Injectable()
export class FilesProvider {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(File) private fileRepository: Repository<File>,
    private readonly awsProvider: AwsProvider,
    private readonly exceptionsProvider: ExceptionsProvider,
    private readonly authorizationProvider: AuthorizationProvider,
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
          const { fileName, fileUrl } = file;
          return { fileName, fileUrl };
        }) || [],
    };
  }
}
