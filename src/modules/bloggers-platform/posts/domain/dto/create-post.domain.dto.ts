import { CreatePostThroughBlogDto } from '../../../blogs/dto/create-post-through-blog.dto';

export class CreatePostDomainDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;

  constructor(dto: CreatePostThroughBlogDto, blogId: string, blogName: string) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = blogId;
    this.blogName = blogName;
  }
}
