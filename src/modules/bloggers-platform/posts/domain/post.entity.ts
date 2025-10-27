import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreatePostDomainDto } from './dto/create-post.domain.dto';
import { CreatePostDto } from '../dto/create-post.dto';

@Schema({ timestamps: true })
export class Post {
  _id?: any;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: false })
  blogName: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  // createdAt и updatedAt создаются автоматически через timestamps
  createdAt: Date;
  updatedAt: Date;

  @Prop({
    type: Object,
    default: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    },
  })
  extendedLikesInfo?: {
    likesCount: number;
    dislikesCount: number;
    myStatus: 'None' | 'Like' | 'Dislike';
    newestLikes: {
      addedAt: Date;
      userId: string;
      login: string;
    }[];
  };

  /**
   * Factory method to create a Post entity
   * (DDD: создание через фабричный метод, а не напрямую)
   */
  static createInstance(dto: CreatePostDomainDto): Post {
    const post = new Post();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = dto.blogName;
    post.createdAt = dto.createdAt;
    post.deletedAt = null;
    return post;
  }

  update(dto: CreatePostDto): void {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = dto.blogId;
  }

  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error('Deleted');
    }
    this.deletedAt = new Date();
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;
export type PostModelType = Model<PostDocument> & typeof Post;
