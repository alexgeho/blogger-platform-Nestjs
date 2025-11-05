import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  appSetup(app); // глобальные настройки приложения

  // Получаем доступ к ConfigService (он приходит из configModule)
  const config = app.get(ConfigService);
  const port = config.get<string>('PORT') || '5005';
  const jwtSecret = config.get<string>('JWT_SECRET');

  console.log('JWT_SECRET =', jwtSecret);

  await app.listen(port);
  console.log(`🚀 Server is running on port ${port}`);
}

bootstrap();
