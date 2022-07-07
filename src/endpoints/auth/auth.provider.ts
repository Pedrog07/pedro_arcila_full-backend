import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'entities';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './types';
import { ExceptionsProvider } from 'providers';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly exceptionsProvider: ExceptionsProvider,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDTO) {
    const { email, password } = data;

    if (!email || !password) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Missing some fields',
      );
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.UNAUTHORIZED,
        'Does not have access',
      );
    }

    if (!bcrypt.compareSync(password, user.password)) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.UNAUTHORIZED,
        'Invalid password',
      );
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.JWT_SECRET,
      },
    );

    return {
      accessToken,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
