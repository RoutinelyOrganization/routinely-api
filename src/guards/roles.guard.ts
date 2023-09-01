import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SessionService } from 'src/modules/Session/session.service';
import { RoleLevel, Permissions } from './roles.config';
import { CREDENTIALS_KEY } from 'src/utils/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  private credentials = {
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
    const firstRequiredRole = requiredRoles?.length && requiredRoles[0];

    if (!firstRequiredRole) {
      throw new InternalServerErrorException('unspecified permissions');
    }

    const isResetPasswordRequest = firstRequiredRole === Permissions['001'];

    if (isResetPasswordRequest) {
      return true;
    }

    if (token && !this.isHexString(token)) {
      throw new BadRequestException('Access token has a type error');
    }

    const isRefreshTokenRequest = firstRequiredRole === Permissions['000'];

    if (isRefreshTokenRequest && !token) {
      throw new BadRequestException('Original access token is required');
    }

    if (isRefreshTokenRequest) {
      request[CREDENTIALS_KEY] = {
        sessionToken: token,
      };
      return true;
    }

    if (token) {
      this.credentials = await this.sessionService.findSessionToken(token);
    }

    const isInvalid = !this.validatePermissions(
      requiredRoles,
      this.credentials.permissions
    );

    if (isInvalid) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.'
      );
    }

    request[CREDENTIALS_KEY] = {
      sessionToken: token ?? '',
      accountId: this.credentials.accountId,
      permissions: this.credentials.permissions,
    };

    return true;
  }
}
