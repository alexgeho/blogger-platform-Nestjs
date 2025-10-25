import { Injectable } from '@nestjs/common';
import { BlogViewDto } from '../view-dto/blogs.view-dto';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { CreateBlogDomainDto } from '../domain/dto/create-blog.domain.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository,
  ) {
  }

  async createBlog(dto: CreateBlogDto): Promise<BlogViewDto> {
    const domainDto = new CreateBlogDomainDto();
    domainDto.name = dto.name;
    domainDto.description = dto.description;
    domainDto.websiteUrl = dto.websiteUrl;

    const blog = this.BlogModel.createInstance(domainDto);

    await this.blogsRepository.save(blog);

    const view = new BlogViewDto();

  },

}

