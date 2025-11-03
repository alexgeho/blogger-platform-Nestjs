import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoreConfig, validateConfig } from './core.config';

@Global()
@Module({
  providers: [
    {
      provide: CoreConfig,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = new CoreConfig(configService);
        validateConfig(config);
        return config;
      },
    },
  ],
  exports: [CoreConfig],
})
export class CoreModule {}
