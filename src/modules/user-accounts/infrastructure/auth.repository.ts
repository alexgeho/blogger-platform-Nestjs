import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import type { UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from '../dto/loginDto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async findUser(dto: LoginDto): Promise<User | null> {
    const user = this.UserModel.findOne({
      $or: [{ login: dto.loginOrEmail }, { email: dto.loginOrEmail }],
    });
    return user;
  }
}
