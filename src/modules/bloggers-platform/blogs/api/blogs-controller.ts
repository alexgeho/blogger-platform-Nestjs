import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BlogsService } from '../application/blogs.service';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogViewDto } from '../view-dto/blogs.view-dto';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { CreatePostThroughBlogDto } from '../dto/create-post-through-blog.dto';
import { PostsViewDto } from '../../posts/view-dto/posts.view-dto';
import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { Types } from 'mongoose';
import { GetBlogByIdQuery } from '../application/queries/get-blog-by-id.query-handler';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';
import { UpdateBlogInputDto } from '../dto/update-blog.input-dto';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/jwt-optional-auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsService: BlogsService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAll(query);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<BlogViewDto> {
    return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get(':id/posts')
  @ApiResponse({
    status: 200,
    description: 'Return all posts of blog',
    type: PaginatedViewDto<PostsViewDto[]>,
  })
  async getPostsOfBlog(
    @Param('id') id: string,
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    return this.blogsService.getPostsOfBlog(id, query);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created blog',
    type: BlogViewDto,
  })
  async createBlog(@Body() dto: CreateBlogDto): Promise<BlogViewDto> {
    const blogId = await this.commandBus.execute<
      CreateBlogCommand,
      Types.ObjectId
    >(new CreateBlogCommand(dto));

    return this.queryBus.execute(new GetBlogByIdQuery(blogId, null));
  }

  @UseGuards(BasicAuthGuard)
  @Post(':id/posts')
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created post for blog',
    type: PostsViewDto,
  })
  async createPostThroughBlog(
    @Param('id') blogId: string,
    @Body() body: CreatePostThroughBlogDto,
  ): Promise<PostsViewDto> {
    return this.blogsService.createPostThroughBlog(body, blogId);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: Types.ObjectId,
    @Body() dto: UpdateBlogInputDto,
  ) {
    return this.commandBus.execute(new UpdateBlogCommand(id, dto));
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: Types.ObjectId) {
    return this.commandBus.execute(new DeleteBlogCommand(id));
  }
}
