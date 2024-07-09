import { Account, Task } from '@prisma/client';

// Service
export type SaveOneInput = Pick<
  Task,
  | 'name'
  | 'description'
  | 'category'
  | 'accountId'
  | 'quantityPerWeek'
  | 'weekDays'
  | 'type'
> & {
  date: string;
  finallyDate?: string;
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

export type ExcludeOneInput = GetOneInput;

export type UpdateInput = Partial<
  Pick<
    Task,
    | 'name'
    | 'description'
    | 'category'
    | 'checked'
    | 'quantityPerWeek'
    | 'type'
    | 'weekDays'
  >
> &
  Pick<Task, 'id' | 'accountId'> & {
    date?: string | undefined;
    finallyDate?: string | undefined;
  };

// Repository
export type InsertOneInput = Pick<
  Task,
  | 'name'
  | 'description'
  | 'category'
  | 'date'
  | 'accountId'
  | 'finallyDate'
  | 'quantityPerWeek'
  | 'weekDays'
  | 'type'
>;

export type TaskId = Task['id'];

export type FindOneOutput = Pick<
  Task,
  | 'id'
  | 'name'
  | 'description'
  | 'finallyDate'
  | 'quantityPerWeek'
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

export type UpdateOneInput = Partial<
  Pick<
    Task,
    | 'name'
    | 'description'
    | 'category'
    | 'checked'
    | 'date'
    | 'finallyDate'
    | 'quantityPerWeek'
    | 'weekDays'
    | 'type'
  >
> &
  Pick<Task, 'id'>;

export type DeleteOneInput = Pick<Task, 'id' | 'accountId'>;
