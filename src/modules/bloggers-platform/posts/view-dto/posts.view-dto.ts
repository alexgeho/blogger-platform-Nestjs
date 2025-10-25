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

    const plain = post.toObject() as Post; // ✅ теперь TS уверен, что это чистый Post

    dto.id = plain._id.toString();
    dto.title = plain.title;
    dto.shortDescription = plain.shortDescription;
    dto.content = plain.content;
    dto.blogId = plain.blogId;
    dto.blogName = plain.blogName;
    dto.createdAt = plain.createdAt?.toISOString() ?? new Date().toISOString();

    dto.extendedLikesInfo = {
      likesCount: plain.extendedLikesInfo?.likesCount ?? 0,
      dislikesCount: plain.extendedLikesInfo?.dislikesCount ?? 0,
      myStatus: plain.extendedLikesInfo?.myStatus ?? 'None',
      newestLikes:
        plain.extendedLikesInfo?.newestLikes?.map(like => ({
          addedAt: like.addedAt?.toISOString() ?? new Date().toISOString(),
          userId: like.userId,
          login: like.login,
        })) ?? [],
    };

    return dto;
  }

}
