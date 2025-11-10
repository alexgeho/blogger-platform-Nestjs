import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';
import { blogConstraints } from '../domain/blog.constants';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  @IsStringWithTrim(
    blogConstraints.name.minLength,
    blogConstraints.name.maxLength,
  )
  name: string;
  @IsString()
  description: string;
  @IsString()
  @IsUrl()
  websiteUrl: string;
}
