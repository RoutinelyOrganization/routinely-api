import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordTokenService } from './passwordToken.service';
import * as crypto from 'crypto';

describe('PasswordToken Unit Tests', () => {
  let service: PasswordTokenService;

  const randomBytesMock = {
    randomBytes: jest.fn().mockReturnThis,
    readUIntBE: jest.fn().mockReturnValue(123),
  } as unknown as jest.Mocked<void>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordTokenService, PrismaService],
    }).compile();

    service = module.get<PasswordTokenService>(PasswordTokenService);
  });

  describe('When creating a new password token', () => {
    it('should generate hash with correct params ', async () => {
      const randomBytesSpy = jest
        .spyOn(crypto, 'randomBytes')
        .mockReturnValue(randomBytesMock);

      const token = await service.create();

      expect(randomBytesSpy).toHaveBeenCalledTimes(2);
      expect(randomBytesSpy).toHaveBeenCalledWith(3);
      expect(token).toBe('123123');
    });
  });
});
