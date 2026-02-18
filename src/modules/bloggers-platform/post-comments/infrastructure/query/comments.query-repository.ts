import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { Comment } from '../../domain/comment.entity';
import type { CommentModelType } from '../../domain/comment.entity';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { CommentViewDto } from '../../view-dto/comment.view-dto';
import { GetCommentsQueryParams } from '../../api/input-dto/get-comments-query-params.input-dto';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { LikeStatus } from '../../../likes/domain/like-status.enum';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: CommentModelType,
    private readonly likesRepository: LikesRepository,
  ) {}

  async getByPostId(
    postId: string,
    query: GetCommentsQueryParams,
    userId: string | null,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const filter: FilterQuery<Comment> = { postId };
    const sortBy = query.sortBy ?? 'createdAt';
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;

    const totalCount = await this.commentModel.countDocuments(filter);

    const comments = await this.commentModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize)
      .lean();

    const items = await Promise.all(
      comments.map(async (c: any) => {
        const myStatus = userId
          ? await this.likesRepository.getMyStatus(
              c._id.toString(),
              userId,
              'Comment',
            )
          : ('None' as LikeStatus);
        return CommentViewDto.mapToView(c, myStatus);
      }),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
