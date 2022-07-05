import { Module } from '@nestjs/common';
import { AwsProvider, UnsplashProvider, MailProvider } from 'providers';

@Module({
  providers: [AwsProvider, UnsplashProvider, MailProvider],
  exports: [AwsProvider, UnsplashProvider, MailProvider],
})
export class SharedModule {}
