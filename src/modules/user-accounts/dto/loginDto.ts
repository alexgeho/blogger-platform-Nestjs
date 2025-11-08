import { IsStringWithTrim } from '../../../core/decorators/validation/is-string-with-trim';

export class LoginDto {
  @IsStringWithTrim(3, 30)
  loginOrEmail: string;

  @IsStringWithTrim(6, 20)
  password: string;
}
