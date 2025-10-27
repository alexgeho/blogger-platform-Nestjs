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

  async getAllByBlogId(
    blogId: string,
    query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const filter: FilterQuery<Post> = { blogId };

    const pageNumber = query.pageNumber;
    const pageSize = query.pageSize;
    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection;

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
