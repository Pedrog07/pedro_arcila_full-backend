import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthorizationProvider {
  constructor(private readonly jwtService: JwtService) {}
  validateToken(token: string) {
    const { sub } = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    if (!sub) {
      throw new HttpException(
        { statusCode: HttpStatus.FORBIDDEN, message: 'Invalid token' },
        HttpStatus.FORBIDDEN,
      );
    }

    return sub;
  }
}
