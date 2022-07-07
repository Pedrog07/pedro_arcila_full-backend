import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authorizationToken = request.headers.authorization;

    let bearerToken = authorizationToken
      ? authorizationToken.split('Bearer ')
      : '';
    bearerToken = typeof bearerToken == 'string' ? bearerToken : bearerToken[1];

    return bearerToken;
  },
);
