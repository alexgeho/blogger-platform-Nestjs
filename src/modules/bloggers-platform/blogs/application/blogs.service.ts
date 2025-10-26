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
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository,
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  async getPostsOfBlog(blogId: string): Promise<PostsViewDto[]> {
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }

    const posts = await this.postsQueryRepository.getAllByBlogId(blogId);
    return posts;


  }

  async createBlog(dto: CreateBlogDto): Promise<string> {
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

    const newPostId = await this.postsService.CreatePostThroughBlogDto(
      body,
      id,
    );

    const postView =
      await this.postsQueryRepository.getByIdOrNotFoundFail(newPostId);


    return postView; // 👈 Вот это обязательный return!
  }
}
