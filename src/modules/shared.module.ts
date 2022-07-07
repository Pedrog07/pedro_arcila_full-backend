import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AwsProvider, UnsplashProvider, MailProvider } from 'providers';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        issuer: 'pedro-a',
        expiresIn: parseInt(process.env.JWT_LIFETIME, 10) || 3600,
        algorithm: 'HS256',
      },
    }),
  ],
  providers: [AwsProvider, UnsplashProvider, MailProvider],
  exports: [AwsProvider, UnsplashProvider, MailProvider, JwtModule],
})
export class SharedModule {}
