import {
  Controller,
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
  upload(@UploadedFile() file, @AuthToken() authToken) {
    return this.filesProvider.upload(file, authToken);
  }
}
