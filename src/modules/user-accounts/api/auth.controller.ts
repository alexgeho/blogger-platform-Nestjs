import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDto } from '../dto/loginDto';
import { AuthService } from '../application/auth.service';
import { UsersService } from '../application/users.service';
import { CreateUserDto } from '../dto/create-user.dto';

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
  async registration(@Body() dto: CreateUserDto): Promise<void> {
    await this.usersService.registration(dto);
  }
}
