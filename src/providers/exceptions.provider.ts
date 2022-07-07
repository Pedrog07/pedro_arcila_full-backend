import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

@Injectable()
export class ExceptionsProvider {
  readonly httpStatus = HttpStatus;

  throwCustomException(code: number, message: string) {
    throw new HttpException({ statusCode: code, message }, code);
  }
}
