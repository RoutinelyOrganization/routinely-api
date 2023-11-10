export class SendEmailError extends Error {
  constructor() {
    super('Erro ao tentar enviar o e-mail de recuperação');
    this.name = 'SendEmailError';
  }
}
