import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from '../dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../infrastructure/auth.repository';
import bcrypt from 'bcrypt';
import { UsersRepository } from '../infrastructure/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user: User | null = await this.authRepository.findUser(dto);
    const passwordHash = await bcrypt.hash(dto.password, 10);
  }
}
