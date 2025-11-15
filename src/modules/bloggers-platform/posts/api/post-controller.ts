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
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { PostsViewDto } from '../view-dto/posts.view-dto';
import { PostsService } from '../application/posts.service';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { LikeStatusInputDto } from '../../likes/dto/like-status.input-dto.ts';
import { LikesService } from '../../likes/application/likes.service';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { CreatePostCommand } from '../application/usecases/create-post.usecase';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { GetPostByIdQuery } from '../application/queries/get-post-by-id.query';

@Controller('posts')
export class PostController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
    private likesService: LikesService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id/like-status')
  @HttpCode(204)
  async likePost(
    @Param('id') parentId: string,
    @Body() dto: LikeStatusInputDto,
    @Req() req: { user: { userId: string } },
  ): Promise<void> {
    const userId = req.user.userId;
    await this.likesService.setLikeStatus(
      parentId,
      userId,
      'Post',
      dto.likeStatus,
    );
  }

  // @Post(':id/comments')
  // @ApiResponse({
  //   status: 201,
  //   description: 'Returns the newly created post',
  //   type: PostsViewDto,
  // })
  // async createComment(
  //   @Body() body: CreateCommentDto,
  //   @Param('id') id: string,
  // ): Promise<PostsViewDto> {
  //   const postId = await this.postsService.createComment(body);
  //   return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  // }

  @Get()
  async getAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    return this.postsQueryRepository.getAll(query);
  }

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id')
  async getById(
    @Param('id') postId: string,
    @Req() req: { user?: { userId: string } },
  ): Promise<PostsViewDto> {
    const userId = req.user?.userId ?? null;
    return this.postsService.getPostById(postId, userId);
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
  async createPost(@Body() dto: CreatePostDto): Promise<PostsViewDto> {
    const postId = await this.commandBus.execute<CreatePostCommand, string>(
      new CreatePostCommand(dto),
    );

    return this.queryBus.execute(new GetPostByIdQuery(postId, null));
  }
}
