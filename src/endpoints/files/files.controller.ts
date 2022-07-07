import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthToken } from 'decorators';
import { FilesProvider } from './files.provider';

@Controller('files')
export class FilesController {
  constructor(private readonly filesProvider: FilesProvider) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file, @AuthToken() authToken: string) {
    return this.filesProvider.upload(file, authToken);
  }

  @Get()
  getUserFiles(@AuthToken() authToken: string) {
    return this.filesProvider.getUserFiles(authToken);
  }
}
