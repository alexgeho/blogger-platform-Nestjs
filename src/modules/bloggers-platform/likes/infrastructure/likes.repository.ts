import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like, LikeDocument } from '../domain/like.entity';
import { LikeStatus } from '../domain/like-status.enum';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>,
  ) {}

  async findOne(
    parentId: string,
    userId: string,
    parentType: 'Post' | 'Comment',
  ) {
    return this.likeModel.findOne({ parentId, userId, parentType });
  }

  async createLike(
    parentId: string,
    userId: string,
    parentType: 'Post' | 'Comment',
    status: LikeStatus,
  ): Promise<void> {
    const like = new this.likeModel({
      parentId,
      parentType,
      userId,
      status,
      createdAt: new Date(),
    });

    await like.save();
  }

  async updateLike(
    parentId: string,
    userId: string,
    parentType: 'Post' | 'Comment',
    newStatus: LikeStatus,
  ): Promise<void> {
    await this.likeModel.updateOne(
      { parentId, userId, parentType },
      { $set: { status: newStatus } },
    );
  }

  async deleteLike(
    parentId: string,
    userId: string,
    parentType: 'Post' | 'Comment',
  ): Promise<void> {
    await this.likeModel.deleteOne({ parentId, userId, parentType });
  }

  // ============================
  // 🔥  New required methods
  // ============================

  async countLikes(parentId: string, parentType: 'Post' | 'Comment') {
    return this.likeModel.countDocuments({
      parentId,
      parentType,
      status: LikeStatus.Like,
    });
  }

  async countDislikes(parentId: string, parentType: 'Post' | 'Comment') {
    return this.likeModel.countDocuments({
      parentId,
      parentType,
      status: LikeStatus.Dislike,
    });
  }

  async getMyStatus(
    parentId: string,
    userId: string,
    parentType: 'Post' | 'Comment',
  ): Promise<LikeStatus | 'None'> {
    const like = await this.likeModel.findOne({
      parentId,
      parentType,
      userId,
    });

    return like?.status ?? 'None';
  }

  async getNewestLikes(parentId: string, parentType: 'Post' | 'Comment') {
    return this.likeModel
      .find({
        parentId,
        parentType,
        status: LikeStatus.Like,
      })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
  }
}
