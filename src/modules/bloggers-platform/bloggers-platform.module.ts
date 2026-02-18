import { Module } from '@nestjs/common';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsController } from './blogs/api/blogs-controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { PostController } from './posts/api/post-controller';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsService } from './posts/application/posts.service';
import { PostsQueryRepository } from './posts/infrastructure/query/posts.query-repository';
import { PostSchema, Post } from './posts/domain/post.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';
import { GetBlogByIdQueryHandler } from './blogs/application/queries/get-blog-by-id.query-handler';
import { UpdateBlogUseCase } from './blogs/application/usecases/update-blog.usecase';
import { DeleteBlogUseCase } from './blogs/application/usecases/delete-blog.usecase';
import { LikesService } from './likes/application/likes.service';
import { LikesRepository } from './likes/infrastructure/likes.repository';
import { Like, LikeSchema } from './likes/domain/like.entity';
import { Comment, CommentSchema } from './post-comments/domain/comment.entity';
import { CommentsRepository } from './post-comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from './post-comments/infrastructure/query/comments.query-repository';
import { CommentsService } from './post-comments/application/comments.service';
import { CommentsController } from './post-comments/api/comments.controller';
import { JwtOptionalAuthGuard } from '../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { CreatePostUseCase } from './posts/application/usecases/create-post.usecase';
import { GetPostByIdQueryHandler } from './posts/application/queries/get-post-by-id.query-handler';
import { DeletePostUseCase } from './posts/application/usecases/delete-post.usecase';
import { UpdatePostUseCase } from './posts/application/usecases/update-post.usecase';

//тут регистрируем провайдеры всех сущностей блоггерской платформы (blogs, posts, comments, etc...)
@Module({
  imports: [
    CqrsModule,
    UserAccountsModule,
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [BlogsController, PostController, CommentsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    LikesService,
    LikesRepository,
    JwtOptionalAuthGuard,
    // --- CQRS handlers ---
    CreatePostUseCase,
    GetPostByIdQueryHandler,
    DeletePostUseCase,
    UpdatePostUseCase,
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    GetBlogByIdQueryHandler,
  ],
  exports: [BlogsService],
})
export class BloggersPlatformModule {}
