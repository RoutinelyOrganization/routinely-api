import { HttpException } from '@nestjs/common';

type iCustomException = {
  property?: string | undefined;
  message?: string | undefined;
};

export class CustomException extends HttpException {
  constructor(message: string, status = 500, property?: string) {
    super(
      {
        errors: [
          {
            property,
            message,
          },
        ],
      },
      status
    );
  }
}

// 400
export class DataValidationError extends CustomException {
  constructor(props: iCustomException) {
    super(props.message || 'Erro em um dado', 400, props.property);
  }
}

// 401
export class AuthorizationError extends CustomException {
  constructor(props: iCustomException) {
    super(props.message || 'Credenciais inválidas', 401, props.property);
  }
}

// 403
export class PermissionError extends CustomException {
  constructor(props: iCustomException) {
    super(
      props.message || 'Você não tem permissão para executar esta ação',
      403,
      props.property
    );
  }
}

// 404
export class NotFoundError extends CustomException {
  constructor(props: iCustomException) {
    super(props.message || 'Informação não encontrada', 404, props.property);
  }
}

// 422
export class UnprocessableEntityError extends CustomException {
  constructor(props: iCustomException) {
    super(
      props.message || 'Sem permissão para alterar a informação',
      422,
      props.property
    );
  }
}

// 429
export class RatelimitError extends CustomException {
  constructor(props: iCustomException) {
    super(
      props.message ||
        'Muitas requisições em um curto período, aguarde e tente novamente mais tarde',
      429,
      props.property
    );
  }
}

// 500
export class InternalServerError extends CustomException {
  constructor(props: iCustomException) {
    super(props.message || 'Erro desconhecido', 500);
  }
}
