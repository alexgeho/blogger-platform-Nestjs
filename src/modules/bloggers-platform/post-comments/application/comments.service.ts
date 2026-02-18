import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from '../domain/comment.entity';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query-repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { GetCommentsQueryParams } from '../api/input-dto/get-comments-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { CommentViewDto } from '../view-dto/comment.view-dto';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../../user-accounts/infrastructure/user.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getByPostId(
    postId: string,
    query: GetCommentsQueryParams,
    userId: string | null,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const post = await this.postsRepository.findById(postId);
    if (!post || post.deletedAt) {
      throw new NotFoundException('Post not found');
    }
    return this.commentsQueryRepository.getByPostId(postId, query, userId);
  }

  async create(
    postId: string,
    dto: CreateCommentDto,
    userId: string,
  ): Promise<CommentViewDto> {
    const post = await this.postsRepository.findById(postId);
    if (!post || post.deletedAt) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = new Comment();
    comment.postId = postId;
    comment.content = dto.content;
    comment.commentatorInfo = {
      userId: user._id.toString(),
      userLogin: user.login,
    };
    comment.likesInfo = { likesCount: 0, dislikesCount: 0 };

    const saved = await this.commentsRepository.save(comment);
    return CommentViewDto.mapToView(saved, 'None');
  }

  async update(
    commentId: string,
    dto: UpdateCommentDto,
    userId: string,
  ): Promise<void> {
    const comment = await this.commentsRepository.findOrNotFoundFail(commentId);
    if (comment.commentatorInfo.userId !== userId) {
      throw new ForbiddenException('Forbidden');
    }
    const updated = await this.commentsRepository.updateContent(
      commentId,
      dto.content,
    );
    if (!updated) {
      throw new NotFoundException('Comment not found');
    }
  }

  async delete(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findOrNotFoundFail(commentId);
    if (comment.commentatorInfo.userId !== userId) {
      throw new ForbiddenException('Forbidden');
    }
    await this.commentsRepository.deleteById(commentId);
  }
}
