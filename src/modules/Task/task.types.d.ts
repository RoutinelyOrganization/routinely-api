import { Account, Task } from '@prisma/client';

// Service
export type SaveOneInput = Pick<
  Task,
  'name' | 'description' | 'tag' | 'priority' | 'category' | 'accountId'
> & {
  date: string;
};

export type GetManyInput = {
  accountId: Account['id'];
  month: string;
  year: string;
};

export type GetOneInput = {
  accountId: Account['id'];
  id: string;
};

// Repository
export type InsertOneInput = Pick<
  Task,
  | 'name'
  | 'description'
  | 'tag'
  | 'priority'
  | 'category'
  | 'date'
  | 'accountId'
>;

export type FindOneInput = Task['id'];

export type FindOneOutput = Pick<
  Task,
  | 'id'
  | 'name'
  | 'description'
  | 'tag'
  | 'priority'
  | 'category'
  | 'date'
  | 'checked'
> & {
  accountId?: Account['id'];
};

export type FindManyInput = {
  accountId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
};

export type FindManyOutput = Array<FindOneOutput>;
