export class CreateUserDomainDto {
  email: string;
  passwordHash: string;
  login: string;
  isEmailConfirmed: boolean;
}
