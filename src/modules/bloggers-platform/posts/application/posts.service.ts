import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/post.entity';
import type { PostModelType } from '../domain/post.entity';
import { CreatePostDomainDto } from '../domain/dto/create-post.domain.dto';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostsViewDto } from '../view-dto/posts.view-dto';
import { CreatePostThroughBlogDto } from '../../blogs/dto/create-post-through-blog.dto';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const blog = await this.blogsRepository.findById(dto.blogId);

    if (!blog) {
      throw new NotFoundException(`Blog with id ${dto.blogId} not found`);
    }

    const domainDto = new CreatePostDomainDto(dto, dto.blogId, blog.name);

    const post = this.PostModel.createInstance(domainDto);

    const createdPost = await this.postsRepository.save(post);

    return createdPost._id.toString();
  }

  async CreatePostThroughBlogDto(
    dto: CreatePostThroughBlogDto,
    id: string,
  ): Promise<PostsViewDto> {

    const blog = await this.blogsRepository.findById(id);

    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    const domainDto = new CreatePostDomainDto(dto, id, blog.name);

    const post = this.PostModel.createInstance(domainDto);
    const createdPost = await this.postsRepository.save(post);

    return createdPost._id.toString();
  }
}