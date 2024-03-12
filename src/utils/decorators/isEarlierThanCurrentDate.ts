import { registerDecorator, ValidationOptions } from 'class-validator';
import { TimezonePtBR } from 'src/config/constants';

export function IsEarlierThanCurrentDate(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEarlierThanCurrentDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          try {
            const now = new Date().getTime();
            const input = new Date(value.concat(' ', TimezonePtBR)).getTime();

            return now < input;
          } catch (_) {
            return false;
          }
        },
      },
    });
  };
}
