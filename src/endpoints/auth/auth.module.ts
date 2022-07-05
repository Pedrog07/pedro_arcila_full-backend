import { Module } from '@nestjs/common';
import { AuthProvider } from './auth.provider';
import { AuthController } from './auth.controller';
import { SharedModule } from 'modules';

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  providers: [AuthProvider],
})
export class AuthModule {}
