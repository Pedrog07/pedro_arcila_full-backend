import { Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post()
  register() {
    return {
      message: 'register successful',
    };
  }
}
