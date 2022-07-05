import { Module } from '@nestjs/common';
import { UsersProvider } from './users.provider';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersProvider],
})
export class UsersModule {}
