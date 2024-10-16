import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { Permissions, RequirePermissions, RolesGuard } from 'src/guards';
import { CREDENTIALS_KEY } from 'src/utils/constants';
import { SessionService } from '../Session/session.service';
import {
  AccessAccountControllerInput,
  ChangePasswordInput,
  CreateAccountControllerInput,
  DisconnectAccountControllerInput,
  QueryCallBackUrl,
  RefreshSessionControllerInput,
  ResetPasswordInput,
  ValidateTokenInput,
} from './account.dtos';
import { AccountService } from './account.service';

@UseGuards(ThrottlerGuard, RolesGuard)
@Controller('auth')
export class AccountController {
  constructor(
    private accountService: AccountService,
    private sessionService: SessionService
  ) {}

  @ApiTags('Authentication')
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

  @ApiTags('Authentication')
  @Post('register')
  @RequirePermissions([Permissions['100']])
  async create(
    @Body()
    data: CreateAccountControllerInput,
    @Query() { callBackUrl }: QueryCallBackUrl
  ) {
    const { message } = await this.accountService.createAccount(
      data,
      callBackUrl
    );

    return {
      message,
    };
  }

  @ApiTags('Authentication')
  @ApiBearerAuth()
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

  @ApiTags('Authentication')
  @ApiBearerAuth()
  @Post('disconnect')
  @HttpCode(200)
  @RequirePermissions([Permissions['101'], Permissions['102']])
  async disconnect(
    @Body() { closeAllSessions }: DisconnectAccountControllerInput,
    @Req() request: Request
  ) {
    const { sessionToken, accountId } = request[CREDENTIALS_KEY];

    const response = await this.sessionService.closeSession({
      closeAllSessions: !!closeAllSessions,
      sessionToken,
      accountId,
    });

    return response;
  }

  @ApiTags('Password reset')
  @Post('resetpassword')
  @RequirePermissions([Permissions['001']])
  async resetPassword(@Body() resetPasswordInput: ResetPasswordInput) {
    try {
      return await this.accountService.resetPassword(resetPasswordInput);
    } catch (e) {
      throw e;
    }
  }

  @ApiTags('Validate code')
  @Post('validatecode')
  @RequirePermissions([Permissions['001']])
  async validateCode(@Body() validateTokenInput: ValidateTokenInput) {
    try {
      await this.accountService.validateCode(validateTokenInput);
      return { message: 'Validação bem-sucedida!' };
    } catch (e) {
      throw e;
    }
  }

  @ApiTags('Password reset')
  @Put('changepassword')
  @RequirePermissions([Permissions['001']])
  async changePassword(@Body() changePasswordInput: ChangePasswordInput) {
    try {
      await this.accountService.changePassword(changePasswordInput);
      return { message: 'Senha alterada com sucesso' };
    } catch (e) {
      throw e;
    }
  }

  @ApiTags('confirm email')
  @Get('confirmemail')
  @RequirePermissions([Permissions['001']])
  async confirmEmail(@Query() confirmEmailquery: string, @Res() res: Response) {
    try {
      const { callBackUrl } = await this.accountService.confirmEmail(
        confirmEmailquery
      );
      return res.redirect(callBackUrl);
    } catch (e) {
      throw e;
    }
  }
}
