import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query-repository';
import { Types } from 'mongoose';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { UsersExternalQueryRepository } from '../../../../user-accounts/infrastructure/external-query/users.external-query-repository';
import { BlogViewDto } from '../../view-dto/blogs.view-dto';

export class GetBlogByIdQuery {
  constructor(
    public id: Types.ObjectId,
    public userId: Types.ObjectId | null,
  ) {}
}

@QueryHandler(GetBlogByIdQuery)
export class GetBlogByIdQueryHandler
  implements IQueryHandler<GetBlogByIdQuery, BlogViewDto>
{
  constructor(
    @Inject(BlogsQueryRepository)
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly usersQueryRepository: UsersExternalQueryRepository,
  ) {}

  async execute(query: GetBlogByIdQuery): Promise<BlogViewDto> {
    return this.blogsQueryRepository.getByIdOrNotFoundFail(query.id.toString());
  }
}
