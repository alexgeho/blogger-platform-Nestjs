import { UsersSortBy } from './users-sort-by';
import {
  BaseQueryParams,
  SortDirection,
} from '../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

// 📘 DTO для запроса списка пользователей
export class GetUsersQueryParams extends BaseQueryParams {
  // сортировка по полю
  @IsEnum(UsersSortBy)
  @IsOptional()
  sortBy: UsersSortBy = UsersSortBy.CreatedAt;

  // направление сортировки
  @IsEnum(SortDirection)
  @IsOptional()
  @Type(() => String)
  sortDirection: SortDirection = SortDirection.Desc;

  // фильтр по логину
  @IsString()
  @IsOptional()
  searchLoginTerm: string | null = null;

  // фильтр по email
  @IsString()
  @IsOptional()
  searchEmailTerm: string | null = null;
}
