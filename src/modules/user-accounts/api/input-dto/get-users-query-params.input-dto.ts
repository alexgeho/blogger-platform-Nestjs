import { UsersSortBy } from './users-sort-by';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { SortDirection } from '../../../../core/dto/base.query-params.input-dto';

export class GetUsersQueryParams extends BaseQueryParams {
  sortBy: UsersSortBy = UsersSortBy.CreatedAt;
  sortDirection: SortDirection = SortDirection.Desc;
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;
}
