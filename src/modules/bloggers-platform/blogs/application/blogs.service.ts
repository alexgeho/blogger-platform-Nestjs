import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import type { BlogModelType } from '../domain/blog.entity';
import { Blog } from '../domain/blog.entity';
import { CreateBlogDomainDto } from '../domain/dto/create-blog.domain.dto';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { CreatePostThroughBlogDto } from '../dto/create-post-through-blog.dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostsViewDto } from '../../posts/view-dto/posts.view-dto';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository,
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  async deleteBlog(id: string): Promise<void> {
    console.log('➡️ deleteBlog called with id:', id);

    const blogExist = await this.blogsRepository.findById(id);

    if (!blogExist) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Blog with id ${id.toString()} not found`,
      });
    }

    await this.blogsRepository.deleteBlog(blogExist);
  }

  async updateBlog(id: string, dto: CreateBlogDto): Promise<string> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Blog with id ${id.toString()} not found`,
      });
    }
    blog.update(dto);

    await this.blogsRepository.save(blog);

    return blog._id.toString();
  }

  async getPostsOfBlog(
    blogId: string,
    query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Blog with not found`,
      });
    }

    return await this.postsQueryRepository.getAllByBlogId(blogId, query);
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
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Blog with not found`,
      });
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
