import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule, UsersModule, FilesModule } from 'endpoints';
import { TypeOrmConfig } from 'config';
import { GlobalModule } from 'modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [TypeOrmConfig],
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    GlobalModule,
    AuthModule,
    UsersModule,
    FilesModule,
  ],
})
export class AppModule {}
