import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDomainDto } from './dto/create-blog.domain.dto';

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

  /**
   * Factory method to create a Blog entity
   * (DDD: создание через фабричный метод, а не напрямую)
   */
  static createInstance(dto: CreateBlogDomainDto): Blog {
    const blog = new Blog();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.isMembership = true;
    return blog;
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
