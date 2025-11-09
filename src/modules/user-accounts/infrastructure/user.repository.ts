import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.entity';
import type { UserModelType } from '../domain/user.entity';

import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/loginDto';
import { CreateUserDto } from '../dto/create-user.dto';
import { EmailResendDto } from '../api/input-dto/email-resend.dto';

@Injectable()
export class UsersRepository {
  //инжектирование модели через DI
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async findUserByCode(code: string) {
    return await this.UserModel.findOne({ confirmationCode: code });
  }

  async findByLoginOrEmail(dto: LoginDto): Promise<User | null> {
    const user = this.UserModel.findOne({
      $or: [{ login: dto.loginOrEmail }, { email: dto.loginOrEmail }],
    });
    return user;
  }

  async findByCreateUserDto(dto: CreateUserDto) {
    return this.UserModel.findOne({
      $or: [{ login: dto.login }, { email: dto.email }],
    });
  }

  async findByLogin(login: string): Promise<User | null> {
    const user = this.UserModel.findOne({ login });
    return user;
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async findByEmail(dto: EmailResendDto): Promise<UserDocument | null> {
    return this.UserModel.findOne(dto);
  }

  async save(user: UserDocument) {
    await user.save();
  }
}
