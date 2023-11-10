export class AccountNotFoundError extends Error {
  constructor() {
    super('A conta não existe');
    this.name = 'AccountNotFoundError';
  }
}

export class InvalidCodeError extends Error {
  constructor() {
    super('Código inválido');
    this.name = 'InvalidCodeError';
  }
}
