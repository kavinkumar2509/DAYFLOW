import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserSummary } from '@dayflow/shared-types';

export const CurrentUser = createParamDecorator(
  (data: keyof UserSummary | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data && user ? user[data] : user;
  },
);
