import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsOptionsConfig: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
