import { IsString, IsUrl } from 'class-validator';

export class UpdateBlogInputDto {
  @IsString()
  name?: string;
  @IsString()
  description?: string;
  @IsString()
  @IsUrl()
  websiteUrl?: string;
}
