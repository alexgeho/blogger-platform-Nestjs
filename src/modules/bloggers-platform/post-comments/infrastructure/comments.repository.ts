import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comment.entity';
import type { CommentModelType } from '../domain/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: CommentModelType,
  ) {}

  async save(comment: Comment): Promise<CommentDocument> {
    const created = new this.commentModel(comment);
    return created.save();
  }

  async findById(id: string): Promise<CommentDocument | null> {
    return this.commentModel.findById(id);
  }

  async findOrNotFoundFail(id: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async updateContent(id: string, content: string): Promise<boolean> {
    const result = await this.commentModel.updateOne(
      { _id: id },
      { $set: { content } },
    );
    return result.matchedCount > 0;
  }

  async deleteById(id: string): Promise<void> {
    await this.commentModel.deleteOne({ _id: id });
  }
}
