export class AccountNotFoundError extends Error {
  constructor() {
    super('Account does not exists');
    this.name = 'AccountNotFoundError';
  }
}
