import {
  BadRequestException,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

const config: ValidationPipeOptions = {
  exceptionFactory(errors) {
    const formated = errors.map((error) => ({
      property: error.property,
      message: error.constraints[Object.keys(error.constraints)[0]],
    }));

    return new BadRequestException({ errors: formated });
  },
};

export default new ValidationPipe(config);
