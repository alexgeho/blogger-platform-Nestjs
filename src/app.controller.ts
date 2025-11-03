import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import process from 'node:process';
import { CoreConfig } from './core/core.config';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private appConfig: CoreConfig,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('env')
  async getEnv() {
    return {
      PORT: this.configService.get('PORT'),
      PORT2: this.appConfig.port,
      JWT_SECRET: process.env.JWT_SECRET,
      MONGO_URL: process.env.MONGO_URL,
      NODE_ENV: process.env.NODE_ENV,
    };
  }
}
