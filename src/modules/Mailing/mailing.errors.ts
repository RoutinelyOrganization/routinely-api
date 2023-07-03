export class SendEmailError extends Error {
  constructor() {
    super('Nodemailer failed at sending email');
    this.name = 'SendEmailError';
  }
}
