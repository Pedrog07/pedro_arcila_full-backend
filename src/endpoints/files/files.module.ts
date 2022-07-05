import { Module } from '@nestjs/common';
import { FilesProvider } from './files.provider';
import { FilesController } from './files.controller';

@Module({
  controllers: [FilesController],
  providers: [FilesProvider],
})
export class FilesModule {}
