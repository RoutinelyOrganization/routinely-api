import { ValidationOptions } from 'class-validator';

type iValidator = ValidationOptions['message'] | string;

export type iValidationResponses = {
  notEmpty: iValidator;
  boolean: iValidator;
  string: iValidator;
  arrayOfString: iValidator;
  number: iValidator;
  integer: iValidator;
  enum: iValidator;
  arrayMinSize: iValidator;
  arrayMaxSize: iValidator;
  minLength: iValidator;
  maxLength: iValidator;
  minValue: iValidator;
  maxValue: iValidator;
  email: iValidator;
  strongPassword: iValidator;
  fullname: iValidator;
  datePattern: iValidator;
  dateRange: iValidator;
};
