import { IsEnum, IsOptional } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';

export enum CommentsSortBy {
  CreatedAt = 'createdAt',
}

export class GetCommentsQueryParams extends BaseQueryParams {
  @IsOptional()
  @IsEnum(CommentsSortBy)
  sortBy: CommentsSortBy = CommentsSortBy.CreatedAt;
}
