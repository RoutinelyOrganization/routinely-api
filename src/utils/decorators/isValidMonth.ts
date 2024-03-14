import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidMonth(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidMonth',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          try {
            const month = Number(value);
            return !isNaN(month) && month >= 1 && month <= 12;
          } catch (_) {
            return false;
          }
        },
      },
    });
  };
}
