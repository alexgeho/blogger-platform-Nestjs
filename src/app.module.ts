import { configModule } from '../config';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module'; // (Assuming correct path)
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';

console.log('process.env.MONGO_URI:');

@Module({
  imports: [
    configModule,

    // 2. USE MongooseModule.forRootAsync() to inject the configuration service
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        // Get the MONGO_URL from the .env file using the ConfigService
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService], // Inject ConfigService into the factory function
    }),

    UserAccountsModule,
    TestingModule,
    BloggersPlatformModule,
    // (Remove the extra comma here if one exists)
    // ... other modules
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
