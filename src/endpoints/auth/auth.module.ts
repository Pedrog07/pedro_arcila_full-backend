import { Module } from '@nestjs/common';
import { AuthProvider } from './auth.provider';
import { AuthController } from './auth.controller';
import { SharedModule } from 'modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule],
  controllers: [AuthController],
  providers: [AuthProvider],
})
export class AuthModule {}
