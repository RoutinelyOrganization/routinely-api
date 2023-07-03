import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateEmailInput } from './mailing.dtos';
import { SendEmailError } from './mailing.errors';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class MailingService {
  async sendEmail(createEmailInput: CreateEmailInput): Promise<any> {
    const transporter = nodemailer.createTransport({
      host: String(process.env.EMAIL_HOST),
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: false,
    } as nodemailer.TransportOptions);

    const source = readFileSync(
      join(__dirname, '../../../templates/', createEmailInput.template),
      'utf8'
    );
    console.log();
    const compiledTemplate = handlebars.compile(source);

    const emailData = {
      from: createEmailInput.from,
      to: createEmailInput.to,
      subject: createEmailInput.subject,
      html: compiledTemplate(createEmailInput.payload),
    };

    try {
      await transporter.sendMail(emailData);
    } catch (e) {
      console.log(e, 'mailing service');
      throw new SendEmailError();
    }
  }
}
