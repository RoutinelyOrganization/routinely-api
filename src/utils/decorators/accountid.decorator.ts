import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { CREDENTIALS_KEY } from '../constants';

export const AccountId = createParamDecorator(
  (_, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request[CREDENTIALS_KEY].accountId;
  }
);
