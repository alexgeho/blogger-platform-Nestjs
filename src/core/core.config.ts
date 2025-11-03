import { Injectable } from '@nestjs/common';
import process from 'node:process';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsNumber, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CoreConfig {
  @IsNumber()
  port: number;

  @IsNotEmpty()
  mongoURI: string;

  constructor(private readonly configService: ConfigService) {
    this.port = Number(process.env.PORT);
    this.mongoURI = process.env.MONGO_URL || '';
  }
}

// 🟢 отдельная функция для валидации (вне класса)
export function validateConfig(config: CoreConfig) {
  const instance = plainToInstance(CoreConfig, config);
  const errors = validateSync(instance, { skipMissingProperties: false });

  if (errors.length > 0) {
    console.error('❌ Invalid environment configuration:', errors);
    throw new Error('Config validation error');
  }
}
