import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  Response,
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

  @Get(':id')
  async getFile(
    @Response({ passthrough: true }) res,
    @Param() params,
    @AuthToken() authToken: string,
  ): Promise<StreamableFile> {
    const { buffer, mimeType, fileName } = await this.filesProvider.getFile(
      params.id,
      authToken,
    );

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return new StreamableFile(buffer as Uint8Array);
  }

  @Post('rename')
  renameFile(@Body() body, @AuthToken() authToken) {
    return this.filesProvider.renameFile(body, authToken);
  }

  @Post('search-external')
  searchExternalFiles(@Body() body, @AuthToken() authToken: string) {
    return this.filesProvider.searchExternalFiles(body, authToken);
  }
}
