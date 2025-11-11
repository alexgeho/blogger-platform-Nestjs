import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LikeStatus } from './like-status.enum';

@Schema({ timestamps: false, versionKey: false })
export class Like {
  @Prop({ required: true })
  parentId: string; // postId или commentId

  @Prop({ required: true })
  parentType: 'Post' | 'Comment';

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: LikeStatus })
  status: LikeStatus;

  @Prop({ required: true })
  createdAt: Date;
}

export type LikeDocument = Like & Document;
export const LikeSchema = SchemaFactory.createForClass(Like);

// составной уникальный индекс
LikeSchema.index({ parentId: 1, userId: 1, parentType: 1 }, { unique: true });
