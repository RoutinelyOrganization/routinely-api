import { randomUUID } from 'crypto';

import { Replace } from '@/helpers/Replace';

import { GoalType } from '../enums/goal-type.enum';
import { GoalPeriodicity } from '../enums/goal-periodicity.enum';
import { Account } from '../../Account/entities/account.entity';

// TODO: add periodicity, type and  account entity
export interface GoalProps {
  description: string;
  goal: string;
  start_data: Date;
  end_date: Date;
  periodicity: GoalPeriodicity;
  type: GoalType;
  account: Account;
  createdAt: Date;
  updatedAt?: Date;
}

export class Goal {
  private _id: string;
  private props: GoalProps;

  constructor(props: Replace<GoalProps, { createdAt?: Date }>, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }
}
