import { Module } from '@nestjs/common';
import { BlogsService } from './application/blogs.service';
import { BlogsController } from './api/blogs-controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsQueryRepository } from './infrastructure/query/blogs.query-repository';
import { Blog, BlogSchema } from './domain/blog.entity';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { BlogsRepository } from './infrastructure/blog.repository';

//тут регистрируем провайдеры всех сущностей блоггерской платформы (blogs, posts, comments, etc...)
@Module({
  imports: [
    UserAccountsModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository, BlogsQueryRepository],
  exports: [BlogsService],
})
export class BloggersPlatformModule {}
