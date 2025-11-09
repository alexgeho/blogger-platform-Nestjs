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

  @Post(':id/posts')
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created post for blog',
    type: PostsViewDto, // <-- тут магия
  })
  async createPostThroughBlog(
    @Param('id') id: string,
    @Body() body: CreatePostThroughBlogDto,
  ): Promise<PostsViewDto> {
    return this.blogsService.createPostThroughBlog(body, id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: string,
    @Body() body: CreateBlogDto,
  ): Promise<BlogViewDto> {
    const blogId: string = await this.blogsService.updateBlog(id, body);

    return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    await this.blogsService.deleteBlog(id);
  }
}
