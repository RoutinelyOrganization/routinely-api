import { SetMetadata } from '@nestjs/common';

export const RequirePermissions = (roles: string[]) =>
  SetMetadata('roles', roles);
