import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersQueryRepository } from '../user-accounts/infrastructure/query/users.query-repository';
import { BlogsService } from './blogs.service';
import { PaginatedViewDto } from '../../core/dto/base.paginated.view-dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private blogsService: BlogsService,
  ) {}

  @Get()
  async getAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAll(query);
  }

  @Post()
  async createBlog(
    @Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.createBlog(body);

    return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);


  }