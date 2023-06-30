export class AccountNotFoundError extends Error {
  constructor() {
    super('Account does not exists');
    this.name = 'AccountNotFoundError';
  }
}

export class InvalidCodeError extends Error {
  constructor() {
    super('Invalid code');
    this.name = 'InvalidCodeError';
  }
}
