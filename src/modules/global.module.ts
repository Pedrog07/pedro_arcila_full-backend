import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthorizationProvider, ExceptionsProvider } from 'providers';

@Global()
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
  providers: [AuthorizationProvider, ExceptionsProvider],
  exports: [AuthorizationProvider, ExceptionsProvider],
})
export class GlobalModule {}
