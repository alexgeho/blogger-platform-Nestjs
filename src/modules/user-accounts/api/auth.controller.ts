import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Req,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from '../dto/loginDto';
import { AuthService } from '../application/auth.service';
import { UsersService } from '../application/users.service';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { EmailResendDto } from './input-dto/email-resend.dto';
import { ConfirmationCode } from './input-dto/confirmation-code';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,

  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    // ⚙️ AuthService теперь возвращает оба токена
    const { accessToken, refreshToken } = await this.authService.login(dto);

    // 🍪 Устанавливаем refreshToken в httpOnly-cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh-token',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    // возвращаем accessToken в теле ответа
    return { accessToken };
    
  }
  
@Get('me')
@UseGuards(JwtAuthGuard)
async me(@Req() req) {
  return this.usersQueryRepository.getByIdOrNotFoundFail(
    req.user.userId,
  );
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
