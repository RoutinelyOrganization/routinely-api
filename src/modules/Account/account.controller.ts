import { Controller, Body, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './account.dtos';
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
}
