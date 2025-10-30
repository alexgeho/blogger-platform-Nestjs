import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import type { UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}
}
