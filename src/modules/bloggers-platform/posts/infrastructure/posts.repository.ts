import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/post.entity';
import type { PostModelType } from '../domain/post.entity';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {
  }

  async save(post: Post): Promise<PostDocument> {
    const createdPost = new this.PostModel(post);
    return createdPost.save();
  }

  async findById(id: string): Promise<PostDocument | null> {
    return this.PostModel.findById(id);
  }

}