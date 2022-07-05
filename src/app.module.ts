import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule, UsersModule, FilesModule } from 'endpoints';
import { getTypeOrmConfig } from 'config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    AuthModule,
    UsersModule,
    FilesModule,
  ],
})
export class AppModule {}
