import { Controller, Body, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateAccountControllerInput,
  AccessAccountControllerInput,
} from './account.dtos';
import { AccountService } from './account.service';
import { SessionService } from '../Session/session.service';

@ApiTags('Authentication routes')
@Controller('auth')
export class AccountController {
  constructor(
    private accountService: AccountService,
    private sessionService: SessionService
  ) {}

  @Post('register')
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

  @Post('')
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
}
