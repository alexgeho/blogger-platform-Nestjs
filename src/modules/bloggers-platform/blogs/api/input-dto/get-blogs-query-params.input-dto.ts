// dto для запроса списка блогов с пагинацией, сортировкой, фильтрами
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { BlogsSortBy } from './blogs-sort-by';

// Наследуемся от базового класса, где уже есть pageNumber, pageSize, sortDirection и т.д.
export class GetBlogsQueryParams extends BaseQueryParams {
  @IsEnum(BlogsSortBy)
  @IsOptional()
  sortBy: BlogsSortBy = BlogsSortBy.CreatedAt;

  @IsString()
  @IsOptional()
  searchNameTerm: string | null = null;
}
