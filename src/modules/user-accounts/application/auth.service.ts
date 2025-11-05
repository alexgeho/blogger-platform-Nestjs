import { LoginDto } from '../dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/user.repository';
import { CryptoService } from './crypto.service';
import * as process from 'node:process';
import { UserContextDto } from '../guards/dto/user-context.dto';

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

  async login(dto: LoginDto): Promise<{ accessToken: string } | null> {
    const user: User | null =
      await this.usersRepository.findByLoginOrEmail(dto);
    console.log('user:', user);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.cryptoService.comparePasswords({
      password: dto.password,
      hash: user.passwordHash,
    });
    console.log('isPasswordValid: ', isPasswordValid, '+');
    if (!isPasswordValid) {
      return null;
    }
    console.log('id-----: ', user._id, '');
    console.log('processENV:::::::::::::', process.env.JWT_SECRET);
    const accessToken = this.jwtService.sign(
      { id: user._id },
      { secret: process.env.JWT_SECRET },
    );

    console.log('accessToken: ', accessToken);

    return { accessToken };
  }
}
