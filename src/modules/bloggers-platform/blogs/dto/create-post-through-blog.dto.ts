import { IsString } from 'class-validator';

export class CreatePostThroughBlogDto {
  @IsString()
  title: string;
  @IsString()
  shortDescription: string;
  @IsString()
  content: string;
}
