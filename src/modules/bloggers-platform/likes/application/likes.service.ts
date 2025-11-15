import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../infrastructure/likes.repository';
import { LikeStatus } from '../domain/like-status.enum';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepo: LikesRepository) {}

  async getExtendedLikesInfo(
    parentId: string,
    userId: string | null,
    parentType: 'Post' | 'Comment',
  ) {
    const likesCount = await this.likesRepo.countLikes(parentId, parentType);
    const dislikesCount = await this.likesRepo.countDislikes(
      parentId,
      parentType,
    );

    const myStatus = userId
      ? await this.likesRepo.getMyStatus(parentId, userId, parentType)
      : 'None';

    const newestLikesRaw = await this.likesRepo.getNewestLikes(
      parentId,
      parentType,
    );

    const newestLikes = newestLikesRaw.map((like) => ({
      addedAt: like.createdAt,
      userId: like.userId,
      login: 'temp',
    }));

    return {
      likesCount,
      dislikesCount,
      myStatus,
      newestLikes,
    };
  }

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
      return;
    }

    if (newStatus === LikeStatus.None) {
      await this.likesRepo.deleteLike(parentId, userId, parentType);
      return;
    }

    if (existingLike.status !== newStatus) {
      await this.likesRepo.updateLike(parentId, userId, parentType, newStatus);
    }
  }
}
