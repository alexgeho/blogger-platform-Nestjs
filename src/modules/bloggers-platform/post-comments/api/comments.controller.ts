import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { CommentsService } from '../application/comments.service';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') commentId: string,
    @Body() dto: UpdateCommentDto,
    @Req() req: { user: { userId: string } },
  ): Promise<void> {
    await this.commentsService.update(commentId, dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') commentId: string,
    @Req() req: { user: { userId: string } },
  ): Promise<void> {
    await this.commentsService.delete(commentId, req.user.userId);
  }
}
