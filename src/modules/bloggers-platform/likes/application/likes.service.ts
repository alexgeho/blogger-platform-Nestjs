import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../infrastructure/likes.repository';
import { LikeStatus } from '../domain/like-status.enum';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepo: LikesRepository,
    private readonly postsRepo: PostsRepository,
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
    console.log('parentId::::::', parentId);
    // 1️⃣ — Если лайка нет и статус не None → создаём
    if (!existingLike) {
      if (newStatus === LikeStatus.None) return;
      await this.likesRepo.createLike(parentId, userId, parentType, newStatus);
    }

    // 2️⃣ — Если пользователь убирает лайк (ставит None) → удаляем
    else if (newStatus === LikeStatus.None) {
      await this.likesRepo.deleteLike(parentId, userId, parentType);
    }

    // 3️⃣ — Если статус изменился (Like → Dislike или наоборот) → обновляем
    else if (existingLike.status !== newStatus) {
      await this.likesRepo.updateLike(parentId, userId, parentType, newStatus);
    }

    // ✅ Обновляем счётчики лайков и дизлайков
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
  }
}
