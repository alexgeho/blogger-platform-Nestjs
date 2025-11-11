import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Like, LikeDocument } from '../domain/like.entity';
import { LikeStatus } from '../domain/like-status.enum';

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Like.name) private LikeModel: Model<LikeDocument>) {}

  async findOne(parentId: string, userId: string, parentType: string) {
    return this.LikeModel.findOne({ parentId, userId, parentType });
  }

  async createLike(
    parentId: string,
    userId: string,
    parentType: string,
    status: LikeStatus,
  ) {
    const like = new this.LikeModel({
      parentId,
      parentType,
      userId,
      status,
      createdAt: new Date(),
    });
    await like.save();
    return like;
  }

  async updateLike(
    parentId: string,
    userId: string,
    parentType: string,
    status: LikeStatus,
  ) {
    await this.LikeModel.updateOne(
      { parentId, userId, parentType },
      { status },
    );
  }

  async deleteLike(parentId: string, userId: string, parentType: string) {
    await this.LikeModel.deleteOne({ parentId, userId, parentType });
  }

  async countByStatus(
    parentId: string,
    parentType: string,
    status: LikeStatus,
  ): Promise<number> {
    return this.LikeModel.countDocuments({ parentId, parentType, status });
  }
}
