import { Module } from '@nestjs/common';
import { FilesProvider } from './files.provider';
import { FilesController } from './files.controller';
import { SharedModule } from 'modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, File } from 'entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, File]), SharedModule],
  controllers: [FilesController],
  providers: [FilesProvider],
})
export class FilesModule {}
