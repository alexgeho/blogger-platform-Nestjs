import { CommentDocument } from '../domain/comment.entity';

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: { userId: string; userLogin: string };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: 'None' | 'Like' | 'Dislike';
  };

  static mapToView(
    comment: CommentDocument | any,
    myStatus: 'None' | 'Like' | 'Dislike' = 'None',
  ): CommentViewDto {
    const dto = new CommentViewDto();
    dto.id = comment._id?.toString?.() ?? comment.id;
    dto.content = comment.content;
    dto.commentatorInfo = comment.commentatorInfo;
    dto.createdAt =
      typeof comment.createdAt === 'string'
        ? comment.createdAt
        : comment.createdAt?.toISOString?.() ?? new Date().toISOString();
    dto.likesInfo = {
      likesCount: comment.likesInfo?.likesCount ?? 0,
      dislikesCount: comment.likesInfo?.dislikesCount ?? 0,
      myStatus,
    };
    return dto;
  }
}
