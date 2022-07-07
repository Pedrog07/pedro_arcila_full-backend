import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'entities';
import { RegisterUserDTO, VerifyEmailDTO } from './types';
import { ExceptionsProvider, MailProvider } from 'providers';
import { entityAssign } from 'utils';

@Injectable()
export class UsersProvider {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly exceptionsProvider: ExceptionsProvider,
    private readonly mailProvider: MailProvider,
  ) {}

  async register(data: RegisterUserDTO) {
    const { email, firstName, lastName, password } = data;

    if (!email || !firstName || !lastName || !password) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Missing some fields',
      );
    }

    const user: User = await this.userRepository.findOne({ where: { email } });

    if (user) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Oops looks like this email is already in use.',
      );
    }

    const newUser = await this.userRepository.save(
      entityAssign(User, { ...data }),
    );

    await this.mailProvider.sendRegistrationEmail(email, {
      firstName,
      verificationCode: newUser.verificationCode,
    });

    return { message: 'Registration completed, please check your email' };
  }

  async verifyEmail(data: VerifyEmailDTO) {
    const { verificationCode, email } = data;

    if (!verificationCode || !email) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Missing some fields',
      );
    }

    const user: User = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.NOT_FOUND,
        'User not found',
      );
    }

    if (user.verificationCode !== verificationCode) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Invalid verification code',
      );
    }

    await this.userRepository.save({ ...user, verifiedEmail: true });

    return { message: 'Verification successful' };
  }
}
