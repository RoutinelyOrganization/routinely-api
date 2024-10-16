import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SessionService } from 'src/modules/Session/session.service';
import { CREDENTIALS_KEY } from 'src/utils/constants';
import { Permissions, RoleLevel } from './roles.config';

@Injectable()
export class RolesGuard implements CanActivate {
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
    let credentials = {
      accountId: 'anonymous',
      permissions: RoleLevel.Anonymous,
    };

    if (!firstRequiredRole) {
      throw new InternalServerErrorException(
        'As permissões necessárias não foram definidas'
      );
    }

    const isResetPasswordRequest = firstRequiredRole === Permissions['001'];

    if (isResetPasswordRequest) {
      return true;
    }

    if (token && !this.isHexString(token)) {
      throw new BadRequestException('O formato do token não está correto');
    }

    const isRefreshTokenRequest = firstRequiredRole === Permissions['000'];

    if (isRefreshTokenRequest && !token) {
      throw new BadRequestException('O token de acesso é necessário');
    }

    if (isRefreshTokenRequest) {
      request[CREDENTIALS_KEY] = {
        sessionToken: token,
      };
      return true;
    }

    if (token) {
      credentials = await this.sessionService.findSessionToken(token);
    }

    const isInvalid = !this.validatePermissions(
      requiredRoles,
      credentials.permissions
    );

    if (isInvalid) {
      throw new ForbiddenException(
        'Você não tem permissão para realizar esta ação.'
      );
    }

    request[CREDENTIALS_KEY] = {
      sessionToken: token ?? '',
      accountId: credentials.accountId,
      permissions: credentials.permissions,
    };

    return true;
  }
}
