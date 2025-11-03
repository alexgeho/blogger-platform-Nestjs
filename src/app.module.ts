import { configModule } from '../config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module'; // (Assuming correct path)
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { CoreConfig } from './core/core.config';
import { CoreModule } from './core/core.module';
import { AppService } from './app.service';

@Module({
  imports: [
    configModule,
    CoreModule,
    MongooseModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => ({
        uri: coreConfig.mongoURI,
      }),
      inject: [CoreConfig],
    }),
    UserAccountsModule,
    TestingModule,
    BloggersPlatformModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
