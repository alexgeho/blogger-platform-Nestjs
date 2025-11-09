import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from '../dto/loginDto';
import { AuthService } from '../application/auth.service';
import { UsersService } from '../application/users.service';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { EmailResendDto } from './input-dto/email-resend.dto';
import { ConfirmationCode } from './input-dto/confirmation-code';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string } | null> {
    return await this.authService.login(dto);
  }
  @Post('registration')
  @HttpCode(204)
  async registration(@Body() dto: CreateUserInputDto): Promise<void> {
    await this.usersService.registration(dto);
  }
  @Post('registration-email-resending')
  @HttpCode(204)
  async emailResending(@Body() dto: EmailResendDto): Promise<void> {
    await this.usersService.emailResending(dto);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body() code: ConfirmationCode,
  ): Promise<void> {
    await this.usersService.registrationConfirmation(code);
  }
}
