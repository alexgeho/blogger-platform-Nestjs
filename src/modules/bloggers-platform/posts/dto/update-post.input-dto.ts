import { IsNotEmpty, IsString } from 'class-validator';
import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';
import { postConstraints } from '../domain/post.constants';

export class UpdatePostInputDto {
  @IsNotEmpty()
  @IsString()
  @IsStringWithTrim(
    postConstraints.title.minLength,
    postConstraints.title.maxLength,
  )
  title?: string;
  @IsStringWithTrim(
    postConstraints.title.minLength,
    postConstraints.shortDescription.maxLength,
  )
  shortDescription?: string;
  @IsStringWithTrim(
    postConstraints.title.minLength,
    postConstraints.content.maxLength,
  )
  content?: string;
  @IsString()
  blogId?: string;
}
