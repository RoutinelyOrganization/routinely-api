import { Test, TestingModule } from '@nestjs/testing';
import { MailingService } from './mailing.service';
import * as nodemailer from 'nodemailer';

import { CreateEmailInput } from './mailing.dtos';
import { faker } from '@faker-js/faker';
import { SendEmailError } from './mailing.errors';

describe('MailingService Unit Tests', () => {
  let service: MailingService;

  const createTransportMock = {
    sendMail: jest.fn(),
  } as unknown as jest.Mocked<nodemailer.Transporter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailingService],
    }).compile();

    service = module.get<MailingService>(MailingService);
  });

  describe('#sendMail', () => {
    const createEmailInput: CreateEmailInput = {
      from: process.env.FROM_EMAIL,
      to: faker.internet.email(),
      subject: faker.word.words(10),
      html: 'html_template',
    };
    it('calls nodemailer.Transport with correct params', async () => {
      const nodemailerSpy = jest
        .spyOn(nodemailer, 'createTransport')
        .mockImplementationOnce(() => createTransportMock);

      await service.sendEmail(createEmailInput);

      expect(nodemailerSpy).toHaveBeenCalledWith({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    });

    it('calls .sendEmail with correct params', async () => {
      jest
        .spyOn(nodemailer, 'createTransport')
        .mockImplementationOnce(() => createTransportMock);

      await service.sendEmail(createEmailInput);

      expect(createTransportMock.sendMail).toHaveBeenCalledWith(
        createEmailInput
      );
    });

    it('throws error if .sendMail fails', async () => {
      jest
        .spyOn(nodemailer, 'createTransport')
        .mockImplementationOnce(() => createTransportMock);
      jest.spyOn(createTransportMock, 'sendMail').mockImplementationOnce(() => {
        throw new Error();
      });

      const promise = service.sendEmail(createEmailInput);

      await expect(promise).rejects.toThrow(new SendEmailError());
    });
  });
});
