import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.entity';
import type { UserModelType } from '../domain/user.entity';

import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from '../dto/loginDto';
import { Types } from 'mongoose';

@Injectable()
export class UsersRepository {
  //инжектирование модели через DI
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async findByLoginOrEmail(dto: LoginDto): Promise<User | null> {
    const user = this.UserModel.findOne({
      $or: [{ login: dto.loginOrEmail }, { email: dto.loginOrEmail }],
    });
    return user;
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async save(user: UserDocument) {
    await user.save();
  }

  async findOrNotFoundFail(id: string): Promise<UserDocument> {
    const user = await this.findById(id);

    if (!user) {
      //TODO: replace with domain exception
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
