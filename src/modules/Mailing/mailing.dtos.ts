export class CreateEmailInput {
  from: string;
  to: string;
  subject: string;
  payload: any;
  template: string;
}
