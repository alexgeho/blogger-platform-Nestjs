import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../domain/blog.entity';
import type { BlogModelType } from '../../domain/blog.entity';
import { BlogViewDto } from '../../view-dto/blogs.view-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { GetBlogsQueryParams } from '../../api/input-dto/get-blogs-query-params.input-dto';
import { FilterQuery } from 'mongoose';
import {
  DomainException,
  Extension,
} from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}

  async getByIdOrNotFoundFail(id: string): Promise<BlogViewDto> {
    const blog = await this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Validation failed',
        extensions: [new Extension(`blog not exists`, 'blog')],
      });
    }

    return BlogViewDto.mapToView(blog);
  }

  async getAll(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    // 🔹 Фильтр для поиска по имени и исключения удалённых блогов
    const filter: FilterQuery<Blog> = { deletedAt: null };

    if (query.searchNameTerm) {
      filter.name = { $regex: query.searchNameTerm, $options: 'i' };
    }

    // 🔹 Преобразуем направление сортировки ('asc'/'desc') в формат, понятный Mongoose
    const sortDirection = query.sortDirection === SortDirection.Desc ? -1 : 1;

    // 🔹 Запрашиваем список блогов с учётом фильтра, сортировки и пагинации
    const blogs = await this.BlogModel.find(filter)
      .sort({ [query.sortBy]: sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    // 🔹 Считаем общее количество записей под фильтр
    const totalCount = await this.BlogModel.countDocuments(filter);

    // 🔹 Преобразуем документы MongoDB в view-модель для ответа API
    const items = blogs.map((blog) => BlogViewDto.mapToView(blog));

    // 🔹 Формируем DTO с пагинацией и возвращаем результат
    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
