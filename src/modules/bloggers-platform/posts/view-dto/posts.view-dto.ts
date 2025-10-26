import { Post, PostDocument } from '../domain/post.entity';

/**
 * View DTO for Post
 * Used to shape the data returned to clients (no sensitive info)
 */
export class PostsViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: 'None' | 'Like' | 'Dislike';
    newestLikes: {
      addedAt: string;
      userId: string;
      login: string;
    }[];
  };

  /**
   * Converts Post document to PostsViewDto
   * @param {PostDocument} post
   * @returns {PostsViewDto}
   */
  static mapToView(post: PostDocument): PostsViewDto {
    const dto = new PostsViewDto();

    dto.id = post._id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt;

    dto.extendedLikesInfo = {
      likesCount: post.extendedLikesInfo?.likesCount ?? 0,
      dislikesCount: post.extendedLikesInfo?.dislikesCount ?? 0,
      myStatus: post.extendedLikesInfo?.myStatus ?? 'None',
      newestLikes:
        post.extendedLikesInfo?.newestLikes?.map((like) => ({
          addedAt: like.addedAt?.toISOString() ?? new Date().toISOString(),
          userId: like.userId,
          login: like.login,
        })) ?? [],
    };

    return dto;
  }

  static mapManyToView(posts: PostDocument[]): PostsViewDto[] {
    return posts.map((p) => PostsViewDto.mapToView(p));
  }
}
