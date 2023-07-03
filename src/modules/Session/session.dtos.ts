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

// Validate
export class FindSessionRepositoryInput extends PickType(SessionBaseDto, [
  'sessionToken',
]) {}

export class FindSessionRepositoryOutpout extends PickType(SessionBaseDto, [
  'accountId',
  'permissions',
]) {}

export class FindSessionServiceOutput extends FindSessionRepositoryOutpout {}

// Refresh
export class FindExpiredSessionRepositoryInput extends PickType(
  SessionBaseDto,
  ['sessionToken']
) {}

export class FindExpiredSessionRepositoryOutput extends PickType(
  SessionBaseDto,
  ['id', 'refreshToken']
) {}

export class UpdateSessionRepositoryInput extends PickType(SessionBaseDto, [
  'id',
  'sessionToken',
  'refreshToken',
  'sessionExpiresIn',
  'refreshExpiresIn',
]) {}

export class RefreshTokenServiceOutput extends OmitType(
  CreateSessionServiceOutput,
  ['name', 'permissions']
) {}
