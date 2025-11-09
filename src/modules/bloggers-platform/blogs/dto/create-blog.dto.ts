import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  websiteUrl: string;
}
