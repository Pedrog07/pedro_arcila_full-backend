import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersProvider } from './users.provider';
import { UsersController } from './users.controller';
import { User, PasswordResetRequest } from 'entities';
import { SharedModule } from 'modules';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordResetRequest]),
    SharedModule,
  ],
  controllers: [UsersController],
  providers: [UsersProvider],
})
export class UsersModule {}
