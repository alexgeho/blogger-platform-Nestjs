import { HttpException, HttpStatus } from '@nestjs/common';
import { DomainExceptionCode } from './domain-exception-codes';

export class Extension {
  constructor(
    public message: string,
    public key: string,
  ) {}
}

export class DomainException extends HttpException {
  code: DomainExceptionCode;
  extensions: Extension[];

  constructor(errorInfo: {
    code: DomainExceptionCode;
    message: string;
    extensions?: Extension[];
  }) {
    const status = DomainException.resolveHttpStatus(errorInfo.code);

    super(
      {
        message: errorInfo.message,
        code: errorInfo.code,
        extensions: errorInfo.extensions || [],
      },
      status,
    );

    this.code = errorInfo.code;
    this.extensions = errorInfo.extensions || [];
  }

  private static resolveHttpStatus(code: DomainExceptionCode): number {
    switch (code) {
      case DomainExceptionCode.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
      case DomainExceptionCode.Forbidden:
        return HttpStatus.FORBIDDEN;
      case DomainExceptionCode.NotFound:
        return HttpStatus.NOT_FOUND;
      case DomainExceptionCode.ValidationError:
      case DomainExceptionCode.BadRequest:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCode.InternalServerError:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.BAD_REQUEST;
    }
  }
}
