import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../infrastructure/likes.repository';
import { LikeStatus } from '../domain/like-status.enum';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
// import { CommentsRepository } from '../../comments/infrastructure/comments.repository';

@Injectable()
export class LikesService {
  constructor(
    private likesRepo: LikesRepository,
    private postsRepo: PostsRepository,
    // private commentsRepo: CommentsRepository,
  ) {}

  async setLikeStatus(
    parentId: string,
    userId: string,
    parentType: 'Post' | 'Comment',
    newStatus: LikeStatus,
  ): Promise<void> {
    const existingLike = await this.likesRepo.findOne(
      parentId,
      userId,
      parentType,
    );

    if (!existingLike) {
      if (newStatus === LikeStatus.None) return;
      await this.likesRepo.createLike(parentId, userId, parentType, newStatus);
    } else if (newStatus === LikeStatus.None) {
      await this.likesRepo.deleteLike(parentId, userId, parentType);
    } else if (existingLike.status !== newStatus) {
      await this.likesRepo.updateLike(parentId, userId, parentType, newStatus);
    }

    // ✅ обновляем счётчики в parent
    const likesCount = await this.likesRepo.countByStatus(
      parentId,
      parentType,
      LikeStatus.Like,
    );
    const dislikesCount = await this.likesRepo.countByStatus(
      parentId,
      parentType,
      LikeStatus.Dislike,
    );

    if (parentType === 'Post') {
      await this.postsRepo.updateLikeCounters(
        parentId,
        likesCount,
        dislikesCount,
      );
    }
    // else {
    //   await this.commentsRepo.updateLikeCounters(
    //     parentId,
    //     likesCount,
    //     dislikesCount,
    //   );
    // }
  }
}
