import { Module, Global } from '@nestjs/common';
import { AuthorizationProvider } from 'providers';

@Global()
@Module({
  providers: [AuthorizationProvider],
  exports: [AuthorizationProvider],
})
export class GlobalModule {}
