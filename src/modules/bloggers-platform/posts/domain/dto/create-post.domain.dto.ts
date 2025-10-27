import { CreatePostThroughBlogDto } from '../../../blogs/dto/create-post-through-blog.dto';

export class CreatePostDomainDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;

  constructor(dto: CreatePostThroughBlogDto, id: string, blogName: string) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = id;
    this.blogName = blogName;
  }
}
