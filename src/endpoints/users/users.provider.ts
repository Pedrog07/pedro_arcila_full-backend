import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, PasswordResetRequest } from 'entities';
import {
  RegisterUserDTO,
  ResetPasswordRequestDTO,
  ResetPasswordDTO,
  VerifyEmailDTO,
} from './types';
import { ExceptionsProvider, MailProvider } from 'providers';
import { entityAssign } from 'utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersProvider {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(PasswordResetRequest)
    private passwordResetRequestRepository: Repository<PasswordResetRequest>,
    private readonly exceptionsProvider: ExceptionsProvider,
    private readonly mailProvider: MailProvider,
    private readonly jwtService: JwtService,
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

  async resendVerifyEmail(data: Omit<VerifyEmailDTO, 'verificationCode'>) {
    const { email } = data;

    if (!email) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Missing email',
      );
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.NOT_FOUND,
        'User not found',
      );
    }

    await this.mailProvider.sendRegistrationEmail(email, {
      firstName: user.firstName,
      verificationCode: user.verificationCode,
    });

    return { message: 'Verification email sent' };
  }

  async verifyEmail(data: VerifyEmailDTO) {
    const { verificationCode, email } = data;

    if (!verificationCode || !email) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Missing some fields',
      );
    }

    const user = await this.userRepository.findOne({ where: { email } });

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

  async resetPasswordRequest({ email }: ResetPasswordRequestDTO) {
    if (!email) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Missing email',
      );
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.NOT_FOUND,
        'User not found',
      );
    }

    if (!user.verifiedEmail) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Please verify your email to proceed.',
      );
    }

    const payload = {
      sub: user.id,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    const request = new PasswordResetRequest();
    request.token = token;
    request.user = user;

    await this.passwordResetRequestRepository.save(request);

    await this.mailProvider.sendPasswordResetEmail(user.email, {
      resetToken: token,
    });

    return { message: 'Please check you email to continue the reset process.' };
  }

  async resetPassword({ token, password }: ResetPasswordDTO) {
    if (!token || !password) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Missing some fields',
      );
    }

    const request = await this.passwordResetRequestRepository
      .createQueryBuilder('request')
      .where('request.token = :token', { token })
      .andWhere('request.used = false')
      .getOne();

    if (!request) {
      this.exceptionsProvider.throwCustomException(
        this.exceptionsProvider.httpStatus.BAD_REQUEST,
        'Invalid token',
      );
    }

    const { sub: id } = this.jwtService.verify(request.token, {
      secret: process.env.JWT_SECRET,
    });

    const user = await this.userRepository.findOne({ where: { id } });

    user.password = password;
    await this.userRepository.save(user);

    request.used = true;
    await this.passwordResetRequestRepository.save(request);

    return { message: 'Password successfuly reset.' };
  }
}
