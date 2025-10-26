import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { FilterQuery } from 'mongoose';
import type { PostDocument, PostModelType } from '../../domain/post.entity';
import { Post } from '../../domain/post.entity';
import { PostsViewDto } from '../../view-dto/posts.view-dto';
import { GetPostsQueryParams } from '../../api/input-dto/get-posts-query-params.input-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  // ✅ Получить все посты конкретного блога (с пагинацией)
  async getAllByBlogId(
    blogId: string,
    query?: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const filter: FilterQuery<Post> = { blogId, deletedAt: null };

    // Если query нет (например, вызов из BlogsService без пагинации)
    const pageNumber = query?.pageNumber ?? 1;
    const pageSize = query?.pageSize ?? 10;
    const sortBy = query?.sortBy ?? 'createdAt';
    const sortDirection = query?.sortDirection ?? -1;

    const totalCount = await this.PostModel.countDocuments(filter);

    const posts = await this.PostModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const items = PostsViewDto.mapManyToView(posts);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: pageNumber,
      size: pageSize,
    });
  }

  // ✅ Получить пост по id
  async getByIdOrNotFoundFail(id: string): Promise<PostsViewDto> {
    const post = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!post) throw new NotFoundException('Post not found');

    return PostsViewDto.mapToView(post);
  }

  async getAll(
    query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const filter: FilterQuery<Post> = {};

    // Получаем посты с сортировкой, пагинацией и фильтрацией
    const posts = await this.PostModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.PostModel.countDocuments(filter);
    const items = posts.map(PostsViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
