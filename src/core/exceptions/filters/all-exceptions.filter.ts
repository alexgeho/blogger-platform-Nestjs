import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

//https://docs.nestjs.com/exception-filters#exception-filters-1
//Все ошибки
@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    console.log('⚠️ AllExceptionFilter triggered::::::::', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 🧠 Если это валидационная ошибка (DomainException или подобное)
    if (
      exception.code === 5 || // DomainExceptionCode.ValidationError
      exception.message === 'Validation failed'
    ) {
      const responseBody = {
        errorsMessages: (exception.extensions || []).map((e: any) => ({
          message: e.message,
          field: e.key,
        })),
      };
      response.status(HttpStatus.BAD_REQUEST).json(responseBody);
    }

    // ⚙️ Всё остальное — 500
    const message = exception.message || 'Unknown exception occurred.';
    const responseBody = {
      errorsMessages: [{ message, field: 'unknown' }],
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseBody);
  }
}
