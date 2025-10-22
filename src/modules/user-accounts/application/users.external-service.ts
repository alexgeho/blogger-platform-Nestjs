import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../../../Downloads/ed-back-lessons-bloggers-nest-main/src/modules/user-accounts/domain/user.entity';
import { UsersRepository } from '../../../../../Downloads/ed-back-lessons-bloggers-nest-main/src/modules/user-accounts/infrastructure/users.repository';

@Injectable()
export class UsersExternalService {
  constructor(
    //инжектирование модели в сервис через DI
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
  ) {}

  async makeUserAsSpammer(userId: string) {
    const user = await this.usersRepository.findOrNotFoundFail(userId);

    // user.makeSpammer();

    await this.usersRepository.save(user);
  }
}
