import type { iValidationResponses } from './types';

export const responses: iValidationResponses = {
  notEmpty: 'Não pode estar vazio',
  boolean: 'Deve ser verdadeiro ou falso (true | false)',
  string: 'Deve ser um texto',
  arrayOfString: 'Deve ser uma lista de textos',
  number: 'Deve ser um número',
  integer: 'Deve ser um número inteiro',
  enum(validationArguments) {
    const enums = validationArguments.constraints[1];
    return `Deve ser um texto entre essas opções: ${enums}`;
  },
  arrayMinSize(validationArguments) {
    const min = validationArguments.constraints[0];
    return `Deve ter no mínimo ${min} item(ns)`;
  },
  arrayMaxSize(validationArguments) {
    const max = validationArguments.constraints[0];
    return `Deve ter no máximo ${max} item(ns)`;
  },
  minLength(validationArguments) {
    const min = validationArguments.constraints[0];
    return `Deve ter no mínimo ${min} caracteres`;
  },
  maxLength(validationArguments) {
    const max = validationArguments.constraints[0];
    return `Deve ter no máximo ${max} caracteres`;
  },
  minValue(validationArguments) {
    const min = validationArguments.constraints[0];
    return `O valor mínimo deve ser ${min}`;
  },
  maxValue(validationArguments) {
    const max = validationArguments.constraints[0];
    return `O valor máximo deve ser ${max}`;
  },
  email: 'O e-mail deve ter um formato válido',
  strongPassword:
    'Deve conter no mínimo 6 caracteres com uma letra maiúscula, uma letra minúscula, um número e um símbolo',
  fullname: 'Deve conter apenas letras e espaço em branco entre palavras',
  datePattern: 'Deve ser um texto nesse padrão, YYYY-MM-DD',
  dateRange: 'O mês e o dia devem ser válidos',
};
