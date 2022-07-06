import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get()
  async hellow() {
    return { message: 'Hello world' };
  }
}
