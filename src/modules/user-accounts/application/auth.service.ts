import { LoginDto } from '../dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../domain/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/user.repository';
import { CryptoService } from './crypto.service';
import * as process from 'node:process';
import { UserContextDto } from '../guards/dto/user-context.dto';
import {
  DomainException,
  Extension,
} from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
  ) {}

  async validateUser(
    login: string,
    password: string,
  ): Promise<UserContextDto | null> {
    const user = await this.usersRepository.findByLogin(login);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.cryptoService.comparePasswords({
      password,
      hash: user.passwordHash,
    });

    if (!isPasswordValid) {
      return null;
    }

    return { id: user._id.toString() };
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersRepository.findByLoginOrEmail(dto);

    if (!user) {
      const field = dto.loginOrEmail.includes('@') ? 'email' : 'login';
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'User not found',
        extensions: [new Extension(`User with this ${field} not found`, field)],
      });
    }

    const isPasswordValid = await this.cryptoService.comparePasswords({
      password: dto.password,
      hash: user.passwordHash,
    });

    if (!isPasswordValid) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Invalid credentials',
        extensions: [new Extension('Incorrect password', 'password')],
      });
    }

    const payload = { id: user._id.toString() };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'access-token-secret',
      expiresIn: '5m',
    });

    // 🔹 долгий токен
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-token-secret',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
