import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDomainDto } from './dto/create-blog.domain.dto';
import { CreateBlogDto } from '../dto/create-blog.dto';

@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  websiteUrl: string;

  // createdAt и updatedAt будут созданы Mongoose автоматически
  createdAt?: Date;
  updatedAt?: Date;

  @Prop({ type: Boolean, default: false })
  isMembership: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  /**
   * Factory method to create a Blog entity
   * (DDD: создание через фабричный метод, а не напрямую)
   */
  static createInstance(this: BlogModelType, dto: CreateBlogDto): BlogDocument {
    return new this({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
      deletedAt: null,
    });
  }

  update(dto: CreateBlogDto): void {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }

  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }

  /**
   * Example domain behavior
   */
  makePrivate() {
    this.isMembership = false;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.loadClass(Blog);

export type BlogDocument = HydratedDocument<Blog>;
export type BlogModelType = Model<BlogDocument> & typeof Blog;
