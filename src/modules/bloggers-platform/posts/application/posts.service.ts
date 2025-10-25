import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/post.entity';
import type { PostModelType } from '../domain/post.entity';
import { CreatePostDomainDto } from '../domain/dto/create-post.domain.dto';
import { PostsRepository } from '../infrastructure/posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepository: PostsRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const domainDto = new CreatePostDomainDto();
    domainDto.title = dto.title;
    domainDto.shortDescription = dto.shortDescription;
    domainDto.content = dto.content;
    domainDto.blogId = dto.blogId;

    const post = this.PostModel.createInstance(domainDto);

    const createdPost = await this.postsRepository.save(post);

    return createdPost._id.toString();
  }
}
