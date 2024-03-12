import { Task } from '@prisma/client';

// Service
export type SaveOneInput = Pick<
  Task,
  'name' | 'description' | 'tag' | 'priority' | 'category' | 'accountId'
> & {
  date: string;
};

export type GetManyInput = {
  accountId: string;
  month: string;
  year: string;
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

export type FindManyInput = {
  accountId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
};

export type FindManyOutput = Array<
  Pick<
    Task,
    | 'id'
    | 'name'
    | 'description'
    | 'tag'
    | 'priority'
    | 'category'
    | 'date'
    | 'checked'
  >
>;
