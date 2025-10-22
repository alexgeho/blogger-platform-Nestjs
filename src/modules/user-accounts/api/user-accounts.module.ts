import { Module } from '@nestjs/common';
import { UsersController } from './users-controller';
import { UsersService } from './users-service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../domain/user.entity';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { SecurityDevicesQueryRepository } from '../infrastructure/query/security-devices.query-repository';
import { AuthQueryRepository } from '../infrastructure/query/auth.query-repository';
import { UsersExternalQueryRepository } from '../infrastructure/external-query/users.external-query-repository';
import { UsersExternalService } from '../application/users.external-service';
import { UsersRepository } from '../infrastructure/user.repository';
import { AuthController } from './auth.controller';
import { SecurityDevicesController } from './security-devices.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    SecurityDevicesQueryRepository,
    AuthQueryRepository,
    UsersExternalQueryRepository,
    UsersExternalService,
  ],
  exports: [UsersExternalQueryRepository, UsersExternalService],
})
export class UserAccountsModule {}
