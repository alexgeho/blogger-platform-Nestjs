// DTO for request body when creating a user. Swagger decorators can be added here.
import {
  loginConstraints,
  passwordConstraints,
} from '../../domain/user.entity';
import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';
import { IsEmail, IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';
import { Transform } from 'class-transformer';

export class CreateUserInputDto {
  // Accepts string or number from request; always converted to string before validation
  @Transform(({ value }) => String(value))
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