import { IsString } from 'class-validator';

export class ConfirmationCode {
  @IsString()
  code: string;
}
