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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { PostsViewDto } from '../view-dto/posts.view-dto';
import { PostsService } from '../application/posts.service';

@Controller('posts')
export class PostController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
  ) {}

  @Get()
  async getAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    return this.postsQueryRepository.getAll(query);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<PostsViewDto> {
    return this.postsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.postsService.deletePost(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async putPost(
    @Param('id') id: string,
    @Body() body: CreatePostDto,
  ): Promise<PostsViewDto> {
    return this.postsService.updatePost(id, body);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created post',
    type: PostsViewDto,
  })
  async createPost(@Body() body: CreatePostDto): Promise<PostsViewDto> {
    const postId = await this.postsService.createPost(body);

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }
}
