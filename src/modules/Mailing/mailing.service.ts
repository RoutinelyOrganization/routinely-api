import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateEmailInput } from './mailing.dtos';
import { SendEmailError } from './mailing.errors';

@Injectable()
export class MailingService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async sendEmail(createEmailInput: CreateEmailInput): Promise<any> {
    const transporter = nodemailer.createTransport({
      host: String(process.env.EMAIL_HOST),
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    } as nodemailer.TransportOptions);

    const emailData = {
      from: process.env.FROM_EMAIL,
      to: createEmailInput.to,
      subject: createEmailInput.subject,
      html: createEmailInput.html,
    };

    try {
      await transporter.sendMail(emailData);
    } catch (e) {
      throw new SendEmailError();
    }
  }
}
