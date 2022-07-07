import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthorizationProvider {
  constructor(private readonly jwtService: JwtService) {}
  validateToken(token: string) {
    try {
      if (!token) {
        throw new HttpException(
          {
            statusCode: HttpStatus.FORBIDDEN,
            message: 'Must provide an authorization token',
          },
          HttpStatus.FORBIDDEN,
        );
      }

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
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Acces token has expired',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw e;
    }
  }
}
