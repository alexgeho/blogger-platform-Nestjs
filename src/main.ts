import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllHttpExceptionsFilter } from './core/exceptions/filters/all-exceptions.filter';
import { ConfigService } from '@nestjs/config';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exceptions.filter';
import { pipesSetup } from './setup/pipes.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const config = app.get(ConfigService);

  pipesSetup(app);
  app.useGlobalFilters(
    new AllHttpExceptionsFilter(),
    new DomainHttpExceptionsFilter(),
  );

  const port = config.get<string>('PORT') || '5005';
  await app.listen(port);
  console.log(`🚀 Server is running on port ${port}`);
}

bootstrap();
