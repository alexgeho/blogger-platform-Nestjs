import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/post.entity';
import type { PostModelType } from '../domain/post.entity';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async updateLikeCounters(
    id: string,
    likesCount: number,
    dislikesCount: number,
  ): Promise<void> {
    await this.PostModel.updateOne({ _id: id }, { likesCount, dislikesCount });
  }

  async save(post: Post): Promise<PostDocument> {
    const createdPost = new this.PostModel(post);
    return createdPost.save();
  }

  async findById(id: string): Promise<PostDocument | null> {
    return this.PostModel.findById(id);
  }

  async findOrNotFoundFail(id: string): Promise<PostDocument> {
    const post = await this.PostModel.findById(id);

    if (!post) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    return post;
  }

  async deletePost(postExist: PostDocument): Promise<void> {
    postExist.makeDeleted();
    await postExist.save();
  }
}
