import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../domain-exceptions';
import { DomainExceptionCode } from '../domain-exception-codes';

// 🎯 Ловим только DomainException
@Catch(DomainException)
export class DomainHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    console.log('🔥 DomainHttpExceptionsFilter triggered::::::::', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Определяем правильный HTTP статус
    const status = this.mapToHttpStatus(exception.code);

    // 🧱 Формируем тело ответа в том же формате, что и AllHttpExceptionsFilter
    const responseBody = {
      errorsMessages: (exception.extensions || []).length
        ? exception.extensions.map((e: any) => ({
            message: e.message,
            field: e.key,
          }))
        : [
            {
              message: exception.message || 'Unknown domain error',
              field: 'unknown',
            },
          ],
    };

    response.status(status).json(responseBody);
  }

  private mapToHttpStatus(code: DomainExceptionCode): number {
    switch (code) {
      case DomainExceptionCode.BadRequest:
      case DomainExceptionCode.ValidationError:
      case DomainExceptionCode.ConfirmationCodeExpired:
      case DomainExceptionCode.EmailNotConfirmed:
      case DomainExceptionCode.PasswordRecoveryCodeExpired:
        return HttpStatus.BAD_REQUEST;

      case DomainExceptionCode.Forbidden:
        return HttpStatus.FORBIDDEN;

      case DomainExceptionCode.NotFound:
        return HttpStatus.NOT_FOUND;

      case DomainExceptionCode.Unauthorized:
        return HttpStatus.UNAUTHORIZED;

      case DomainExceptionCode.InternalServerError:
        return HttpStatus.INTERNAL_SERVER_ERROR;

      default:
        return HttpStatus.BAD_REQUEST;
    }
  }
}
