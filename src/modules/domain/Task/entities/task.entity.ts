import { randomUUID } from 'crypto';
import { Optional } from '@prisma/client/runtime/library';

import { Replace } from '@/helpers/Replace';
import { Account } from '../../Account/entities/account.entity';
// Types
import { TaskPriorities } from '../enums/task-priorities.enum';
import { TaskTags } from '../enums/task-tags.enum';
import { TaskCategories } from '../enums/task-categories.enum';

export interface TaskProps {
  name: string;
  date: Date;
  description: string;
  priority: TaskPriorities;
  tag: TaskTags;
  category: TaskCategories;
  checked: boolean;
  accountId: string;
  account: Account;
  createdAt: Date;
  updatedAt?: Date;
}

export class Task {
  private _id: string;
  private props: TaskProps;

  constructor(props: Replace<TaskProps, { createdAt?: Date }>, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this.props.name;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public get date() {
    return this.props.date;
  }

  public set date(date: Date) {
    this.props.date = date;
  }

  public get description() {
    return this.props.description;
  }

  public set description(description: string) {
    this.props.description = description;
  }

  public get priority() {
    return this.props.priority;
  }

  public set priority(priority: TaskPriorities) {
    this.props.priority = priority;
  }

  public get tag() {
    return this.props.tag;
  }

  public set tag(tag: TaskTags) {
    this.props.tag = tag;
  }

  public get category() {
    return this.props.category;
  }

  public set category(category: TaskCategories) {
    this.props.category = category;
  }

  public get checked() {
    return this.props.checked;
  }

  public set checked(checked: boolean) {
    this.props.checked = checked;
  }

  public get accountId() {
    return this.props.accountId;
  }

  public set accountId(accountId: string) {
    this.props.accountId = accountId;
  }

  public get account() {
    return this.props.account;
  }

  public set account(account: Account) {
    this.props.account = account;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  public update(): void {
    this.props.updatedAt = new Date();
  }

  public create(
    props: Optional<TaskProps, 'createdAt' | 'updatedAt'>,
    id?: string
  ): Task {
    const task = new Task(props, id);

    return task;
  }
}
