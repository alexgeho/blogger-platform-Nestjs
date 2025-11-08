import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllHttpExceptionsFilter } from './core/exceptions/filters/all-exceptions.filter';
import { DomainException } from './core/exceptions/domain-exceptions';
import { DomainExceptionCode } from './core/exceptions/domain-exception-codes';
import { ConfigService } from '@nestjs/config';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // ✅ Подключаем фильтры
  app.useGlobalFilters(
    new DomainHttpExceptionsFilter(), // ловит DomainException
    new AllHttpExceptionsFilter(), // ловит остальные
  );

  // ✅ Глобальный ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: false,
      exceptionFactory: (errors) =>
        new DomainException({
          code: DomainExceptionCode.ValidationError,
          message: 'Validation failed',
          extensions: errors.map((e) => ({
            key: e.property,
            message: Object.values(e.constraints ?? {}).join(', '),
          })),
        }),
    }),
  );

  const port = config.get<string>('PORT') || '5005';
  await app.listen(port);
  console.log(`🚀 Server is running on port ${port}`);
}

bootstrap();
