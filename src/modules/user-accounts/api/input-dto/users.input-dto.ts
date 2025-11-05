//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
import {
  loginConstraints,
  passwordConstraints,
} from '../../domain/user.entity';
import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';
import { IsEmail, IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';

export class CreateUserInputDto {
  @IsStringWithTrim(loginConstraints.minLength, loginConstraints.maxLength)
  login: string;

  @IsString()
  @IsEmail()
  @Trim()
  email: string;

  @IsString()
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  password: string;
}
