import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://user2:rlTZYUNTj0234PGu@cluster0.zgjfrlf.mongodb.net/NestBloggerPlatform?retryWrites=true&w=majority&appName=Cluster0',
    ),
    UserAccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    if (this.connection.readyState === mongoose.ConnectionStates.connected) {
      console.log('✅ Connected to MongoDB');
    } else {
      console.log(
        '❌ MongoDB not connected. State:',
        this.connection.readyState,
      );
    }
  }
}
