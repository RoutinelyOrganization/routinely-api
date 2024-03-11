import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsEarlierThanCurrentDate(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEarlierDateThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          try {
            const now = new Date().getTime();
            const input = new Date(value.concat(' GMT-0300')).getTime();

            return now < input;
          } catch (_) {
            return false;
          }
        },
      },
    });
  };
}
