import { Test, TestingModule } from '@nestjs/testing';
import { MailingService } from './mailing.service';
import * as nodemailer from 'nodemailer';
import { createTransportStub } from './tests/mailing.stubs';

describe('MailingService Unit Tests', () => {
  let service: MailingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailingService],
    }).compile();

    service = module.get<MailingService>(MailingService);
  });

  describe('#sendMail', () => {
    it('calls nodemailer.Transport with correct params', async () => {
      const nodemailerSpy = jest.spyOn(nodemailer, 'createTransport');

      await service.sendEmail();

      expect(nodemailerSpy).toHaveBeenCalledWith({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    });
  });
});
