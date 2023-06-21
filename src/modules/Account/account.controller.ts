import { Controller, Body, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAccountDto, AccessAccountDto } from './account.dtos';
import { AccountService } from './account.service';

@ApiTags('Authentication routes')
@Controller('auth')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('register')
  async create(
    @Body() { name, email, password, acceptedTerms }: CreateAccountDto
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
  async access(@Body() { email, password, remember }: AccessAccountDto) {
    const accountData = await this.accountService.accessAccount({
      email,
      password,
    });

    return;
  }
}
