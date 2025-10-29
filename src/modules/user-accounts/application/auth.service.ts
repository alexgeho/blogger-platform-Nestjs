import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from '../dto/loginDto';
import { User } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../infrastructure/auth.repository';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private authRepository: AuthRepository,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user: User | null = await this.authRepository.findUser(dto);
    const passwordHash = await bcrypt.hash(dto.password, 10);
  }
}
