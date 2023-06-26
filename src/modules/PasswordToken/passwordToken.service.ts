import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

@Injectable()
export class PasswordTokenService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  private generateCode(): string {
    let code = '';

    do {
      code += randomBytes(3).readUIntBE(0, 3);
    } while (code.length < 6);
    return code.slice(0, 6);
  }

  async create(): Promise<string> {
    return this.generateCode();
  }
}
