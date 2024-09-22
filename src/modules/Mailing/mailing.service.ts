import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import { InternalServerError } from 'src/config/exceptions';
import { CreateEmailInput } from './mailing.dtos';

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

    const compiledTemplate = handlebars.compile(source);

    const emailData = {
      from: createEmailInput.from,
      to: createEmailInput.to,
      subject: createEmailInput.subject,
      html: compiledTemplate({
        ...createEmailInput.payload,
        year: new Date().getFullYear(),
      }),
    };

    try {
      await transporter.sendMail(emailData);
    } catch (e) {
      throw new InternalServerError({});
    }
  }
}
