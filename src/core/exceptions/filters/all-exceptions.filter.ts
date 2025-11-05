import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseBody } from './error-response-body.type';
import { DomainExceptionCode } from '../domain-exception-codes';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // ✅ Обработка валидационных ошибок от ValidationPipe
    if (
      status === HttpStatus.BAD_REQUEST &&
      Array.isArray(exception.response?.message)
    ) {
      const errorsMessages = exception.response.message.map((msg: string) => {
        const lower = msg.toLowerCase();
        let field = 'unknown';

        if (lower.includes('login')) field = 'login';
        else if (lower.includes('password')) field = 'password';
        else if (lower.includes('email')) field = 'email';

        return { message: msg, field };
      });

      response.status(status).json({ errorsMessages });
    }

    // ⚙️ Остальные системные ошибки
    const message =
      exception?.message ||
      exception?.response?.message ||
      'Unknown exception occurred.';

    const responseBody = this.buildResponseBody(request.url, message);
    response.status(status).json(responseBody);
  }

  private buildResponseBody(
    requestUrl: string,
    message: string,
  ): ErrorResponseBody {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      timestamp: new Date().toISOString(),
      path: isProduction ? null : requestUrl,
      message: isProduction ? 'Some error occurred' : message,
      extensions: [],
      code: DomainExceptionCode.InternalServerError,
    };
  }
}
