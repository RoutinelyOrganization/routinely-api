import { Request } from 'express';
import {
  Controller,
  Body,
  Post,
  Put,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateAccountControllerInput,
  AccessAccountControllerInput,
  RefreshSessionControllerInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from './account.dtos';
import { AccountService } from './account.service';
import { SessionService } from '../Session/session.service';
import { Permissions, RequirePermissions, RolesGuard } from 'src/guards';
import { CREDENTIALS_KEY } from 'src/config';

@UseGuards(RolesGuard)
@ApiTags('Authentication routes')
@Controller('auth')
export class AccountController {
  constructor(
    private accountService: AccountService,
    private sessionService: SessionService
  ) {}

  @Post('register')
  @RequirePermissions([Permissions['100']])
  async create(
    @Body()
    { name, email, password, acceptedTerms }: CreateAccountControllerInput
  ) {
    const { message } = await this.accountService.createAccount({
      name,
      email,
      password,
      acceptedTerms,
    });

    return {
      message,
    };
  }

  @Post('refresh')
  @HttpCode(200)
  @RequirePermissions([Permissions['000']])
  async refresh(
    @Body() { refreshToken }: RefreshSessionControllerInput,
    @Req() request: Request
  ) {
    const { sessionToken } = request[CREDENTIALS_KEY];

    const newSession =
      await this.sessionService.findExpiredSessionByTokenAndRefreshToken(
        sessionToken,
        refreshToken
      );

    return newSession;
  }

  @Post('')
  @HttpCode(200)
  @RequirePermissions([Permissions['101']])
  async access(
    @Body() { email, password, remember }: AccessAccountControllerInput
  ) {
    const accountData = await this.accountService.accessAccount({
      email,
      password,
    });

    const sessionData = this.sessionService.createSession({
      accountId: accountData.id,
      permissions: accountData.permissions,
      name: accountData.name,
      remember,
    });

    return sessionData;
  }

  @Post('resetpassword')
  async resetPassword(@Body() resetPasswordInput: ResetPasswordInput) {
    try {
      return await this.accountService.resetPassword(resetPasswordInput);
    } catch (e) {
      throw e;
    }
  }

  @Put('changepassword')
  async changePassword(@Body() changePasswordInput: ChangePasswordInput) {
    try {
      return await this.accountService.changePassword(changePasswordInput);
    } catch (e) {
      throw e;
    }
  }
}
