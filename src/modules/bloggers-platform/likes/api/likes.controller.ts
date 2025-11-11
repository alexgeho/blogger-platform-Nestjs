import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { LikesService } from '../application/likes.service';
import { Request } from 'express';
import { LikeStatusInputDto } from '../dto/like-status.input-dto.ts';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Put('posts/:postId/like-status')
  @HttpCode(204)
  async likePost(
    @Param('postId') postId: string,
    @Body() dto: LikeStatusInputDto,
    @Req() req: Request,
  ): Promise<void> {
    const userId = req.user.id;
    await this.likesService.setLikeStatus(
      postId,
      userId,
      'Post',
      dto.likeStatus,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('comments/:commentId/like-status')
  @HttpCode(204)
  async likeComment(
    @Param('commentId') commentId: string,
    @Body() dto: LikeStatusInputDto,
    @Req() req: Request,
  ): Promise<void> {
    const userId = req.user.id;
    await this.likesService.setLikeStatus(
      commentId,
      userId,
      'Comment',
      dto.likeStatus,
    );
  }
}
