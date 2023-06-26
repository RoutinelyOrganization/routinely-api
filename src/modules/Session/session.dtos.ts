import { OmitType, PickType } from '@nestjs/swagger';

class SessionBaseDto {
  id: number;
  sessionToken: string;
  refreshToken: string;
  accountId: string;
  name: string;
  permissions: string[];
  sessionExpiresIn: Date;
  refreshExpiresIn: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create
export class CreateSessionRepositoryInput extends OmitType(SessionBaseDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

export class CreateSessionServiceInput extends PickType(SessionBaseDto, [
  'accountId',
  'permissions',
  'name',
]) {
  remember: boolean;
}

export class CreateSessionServiceOutput extends PickType(SessionBaseDto, [
  'permissions',
  'name',
]) {
  token: string;
  refreshToken: string;
  expiresIn: Date;
}
