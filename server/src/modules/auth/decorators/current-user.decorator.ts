import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserPayload {
  sub: number;
  username: string;
  refreshToken?: string;
}

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
