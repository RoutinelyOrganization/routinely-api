import { ThrottlerOptions, ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlers: Array<ThrottlerOptions> = [
  {
    ttl: 1000,
    limit: 3,
  },
  {
    ttl: 10000,
    limit: 20,
  },
];

export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: throttlers,
  errorMessage: 'Você fez muitas requisições em um curto periodo de tempo.',
};
