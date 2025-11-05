import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DomainException } from '../domain-exceptions';
import { Request, Response } from 'express';
import { DomainExceptionCode } from '../domain-exception-codes';
import { ErrorResponseBody } from './error-response-body.type';

@Catch(DomainException)
export class DomainHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.mapToHttpStatus(exception.code);
    const body = this.buildResponseBody(exception, request.url);

    response.status(status).json(body);
  }

  private readonly httpStatusMap: Record<DomainExceptionCode, HttpStatus> = {
    [DomainExceptionCode.BadRequest]: HttpStatus.BAD_REQUEST,
    [DomainExceptionCode.ValidationError]: HttpStatus.BAD_REQUEST,
    [DomainExceptionCode.ConfirmationCodeExpired]: HttpStatus.BAD_REQUEST,
    [DomainExceptionCode.EmailNotConfirmed]: HttpStatus.BAD_REQUEST,
    [DomainExceptionCode.PasswordRecoveryCodeExpired]: HttpStatus.BAD_REQUEST,
    [DomainExceptionCode.Forbidden]: HttpStatus.FORBIDDEN,
    [DomainExceptionCode.NotFound]: HttpStatus.NOT_FOUND,
    [DomainExceptionCode.Unauthorized]: HttpStatus.UNAUTHORIZED,
    [DomainExceptionCode.InternalServerError]: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  private mapToHttpStatus(code: DomainExceptionCode): number {
    return this.httpStatusMap[code] ?? HttpStatus.I_AM_A_TEAPOT;
  }

  private buildResponseBody(
    exception: DomainException,
    requestUrl: string,
  ):
    | ErrorResponseBody
    | { errorsMessages: { message: string; field: string }[] } {
    // ✅ универсальный формат для ValidationError
    if (exception.code === DomainExceptionCode.ValidationError) {
      const errorsMessages = exception.extensions.map((ext) => ({
        message: ext.message,
        field: ext.key,
      }));
      return { errorsMessages };
    }

    // ⚙️ универсальный формат для остальных DomainException
    return {
      timestamp: new Date().toISOString(),
      path: requestUrl,
      message: exception.message,
      code: exception.code,
      extensions: exception.extensions,
    };
  }
}
