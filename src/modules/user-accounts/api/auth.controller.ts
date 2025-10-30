import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDto } from '../dto/loginDto';
import { AuthService } from '../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string } | null> {
    console.log('login:::::::', dto);
    return await this.authService.login(dto);
  }
}
