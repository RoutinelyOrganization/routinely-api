import { Task } from '@prisma/client';

// Service
export type SaveOneInput = Pick<
  Task,
  'name' | 'description' | 'tag' | 'priority' | 'category' | 'accountId'
> & {
  date: Date | string;
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
