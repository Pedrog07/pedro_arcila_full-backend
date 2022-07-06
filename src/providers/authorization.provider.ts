import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorizationProvider {
  test() {
    return 'authorized';
  }
}
