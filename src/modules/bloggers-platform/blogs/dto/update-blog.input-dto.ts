import { IsString } from 'class-validator';

export class UpdateBlogInputDto {
  @IsString()
  name?: string;
  @IsString()
  description?: string;
  @IsString()
  websiteUrl?: string;
}
