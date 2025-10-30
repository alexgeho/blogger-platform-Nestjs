import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appSetup(app); //глобальные настройки приложения

  const PORT = process.env.PORT || 5005; //TODO: move to configService. will be in the following lessons
  console.log('JWT_SECRET =', process.env.JWT_SECRET);

  await app.listen(PORT, () => {
    console.log('JWT_SECRET =', process.env.JWT_SECRET);
    console.log('Server is running on port ' + PORT);
  });
}

bootstrap();
