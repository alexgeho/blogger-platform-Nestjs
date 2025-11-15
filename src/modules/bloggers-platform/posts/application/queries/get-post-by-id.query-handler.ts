import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsViewDto } from '../../view-dto/posts.view-dto';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
import { Inject } from '@nestjs/common';
import { UsersExternalQueryRepository } from '../../../../user-accounts/infrastructure/external-query/users.external-query-repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { GetPostByIdQuery } from './get-post-by-id.query';

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler
  implements IQueryHandler<GetPostByIdQuery, PostsViewDto>
{
  constructor(
    @Inject(PostsQueryRepository)
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersQueryRepository: UsersExternalQueryRepository,
  ) {}

  async execute(query: GetPostByIdQuery): Promise<PostsViewDto> {
    console.log('queryPostById::::::', query.id.toString());
    return this.postsQueryRepository.getByIdOrNotFoundFail(query.id.toString());
  }
}
