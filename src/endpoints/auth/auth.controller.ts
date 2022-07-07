import { Body, Controller, Post } from '@nestjs/common';
import { AuthProvider } from './auth.provider';

@Controller('auth')
export class AuthController {
  constructor(private readonly authProvider: AuthProvider) {}
  @Post()
  async login(@Body() body: any) {
    return this.authProvider.login(body);
  }
}
