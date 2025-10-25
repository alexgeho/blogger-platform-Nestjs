import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blog.entity';
import type { BlogModelType } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {
  }

  async save(blog: Blog): Promise<BlogDocument> {
    const createdBlog = new this.BlogModel(blog);
    return createdBlog.save();
  }

  async findById(id: string): Promise<BlogDocument | null> {
    return this.BlogModel.findById(id);
  }

}