import { Replace } from '@/helpers/Replace';
import { Optional } from '@prisma/client/runtime/library';
import { randomUUID } from 'crypto';

export interface AccountProps {
  email: string;
  password: string;
  permissions: string[];
  verifiedAt?: Date | null;
  acceptedAt: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export class Account {
  private _id: string;
  private props: AccountProps;

  constructor(
    props: Replace<
      AccountProps,
      { createdAt?: Date; verifiedAt?: Date | null }
    >,
    id?: string
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id() {
    return this._id;
  }

  public get email() {
    return this.props.email;
  }

  public set email(email: string) {
    this.props.email = email;
  }

  public get password() {
    return this.props.password;
  }

  public set password(password: string) {
    this.props.password = password;
  }

  public get permissions() {
    return this.props.permissions;
  }

  public set permissions(permissions: string[]) {
    this.props.permissions = permissions;
  }

  public get verifiedAt() {
    return this.props.verifiedAt;
  }

  public get acceptedAt() {
    return this.props.acceptedAt;
  }

  public set acceptedAt(acceptedAt: Date) {
    this.props.acceptedAt = acceptedAt;
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

  static create(
    props: Optional<AccountProps, 'createdAt' | 'updatedAt' | 'verifiedAt'>,
    id?: string
  ): Account {
    const account = new Account(props, id);

    return account;
  }
}
