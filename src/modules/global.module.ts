import { Module, Global } from '@nestjs/common';
import { AuthorizationProvider, ExceptionsProvider } from 'providers';

@Global()
@Module({
  providers: [AuthorizationProvider, ExceptionsProvider],
  exports: [AuthorizationProvider, ExceptionsProvider],
})
export class GlobalModule {}
