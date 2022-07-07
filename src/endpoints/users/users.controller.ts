import { Body, Controller, Post } from '@nestjs/common';
import { UsersProvider } from './users.provider';

@Controller('users')
export class UsersController {
  constructor(private readonly usersProvider: UsersProvider) {}
  @Post()
  register(@Body() body: any) {
    return this.usersProvider.register(body);
  }

  @Post('verify')
  verifyEmail(@Body() body: any) {
    return this.usersProvider.verifyEmail(body);
  }

  @Post('forgot-password')
  resetPasswordRequest(@Body() body: any) {
    return this.usersProvider.resetPasswordRequest(body);
  }

  @Post('reset-password')
  resetPassword(@Body() body: any) {
    return this.usersProvider.resetPassword(body);
  }
}
