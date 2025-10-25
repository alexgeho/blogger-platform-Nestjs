import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blog.entity';
import type { BlogModelType } from '../domain/blog.entity';
import { CreateBlogDomainDto } from '../domain/dto/create-blog.domain.dto';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { CreatePostThroughBlogDto } from '../dto/create-post-through-blog.dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostsViewDto } from '../../posts/view-dto/posts.view-dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository,
    private postsService: PostsService,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<string> {
    // 1️⃣ Подготавливаем доменный DTO
    const domainDto = new CreateBlogDomainDto();
    domainDto.name = dto.name;
    domainDto.description = dto.description;
    domainDto.websiteUrl = dto.websiteUrl;

    const blog = this.BlogModel.createInstance(domainDto);

    const createdBlog = await this.blogsRepository.save(blog);

    return createdBlog._id.toString();
  }

  async createPostThroughBlog(
    body: CreatePostThroughBlogDto,
    id: string,
  ): Promise<PostsViewDto> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    const newPost = await this.postsService.CreatePostThroughBlogDto(body, id);

    return newPost;
  }
}
