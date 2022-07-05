import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, UsersModule, FilesModule } from 'endpoints';
@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, FilesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
