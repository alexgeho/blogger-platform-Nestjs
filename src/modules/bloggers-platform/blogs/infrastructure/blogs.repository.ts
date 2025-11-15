import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blog.entity';
import type { BlogModelType } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async deleteBlog(blogExist: BlogDocument): Promise<void> {
    blogExist.makeDeleted();
    await blogExist.save();
  }

  async save(blog: BlogDocument): Promise<BlogDocument> {
    return blog.save(); // если это Mongoose-документ
  }

  async findById(id: string): Promise<BlogDocument | null> {
    console.log('idRepository::::::', id);
    return this.BlogModel.findById(id);
  }
}
