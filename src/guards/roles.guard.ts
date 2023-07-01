import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SessionService } from 'src/modules/Session/session.service';
import { RoleLevel } from './roles.config';

@Injectable()
export class RolesGuard implements CanActivate {
  private anonymousAccount = {
    accountId: 'anonymous',
    permissions: RoleLevel.Anonymous,
  };

  constructor(
    private reflector: Reflector,
    private sessionService: SessionService
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isHexString(token: string): boolean {
    return /^[a-fA-F0-9]+$/.test(token);
  }

  private validatePermissions(
    requiredRoles = [],
    accountPermissions: string[]
  ): boolean {
    let response = true;

    for (let i = 0; i < requiredRoles.length; i++) {
      const havePermission = accountPermissions.includes(requiredRoles[i]);
      if (!havePermission) {
        response = false;
        break;
      }
    }

    return response;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler()
    );
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (token && !this.isHexString(token)) {
      throw new UnauthorizedException('Access token has a type error');
    }

    const payload = !token
      ? this.anonymousAccount
      : await this.sessionService.findSessionToken(token);

    const isInvalid = !this.validatePermissions(
      requiredRoles,
      payload.permissions
    );

    if (isInvalid) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.'
      );
    }

    request['credentials'] = {
      accountId: payload.accountId,
      permissions: payload.permissions,
    };

    return true;
  }
}
