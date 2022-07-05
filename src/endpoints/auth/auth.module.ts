import { Module } from '@nestjs/common';
import { AuthProvider } from './auth.provider';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthProvider],
})
export class AuthModule {}
