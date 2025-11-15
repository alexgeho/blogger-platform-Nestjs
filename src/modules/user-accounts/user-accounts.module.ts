import { Module } from '@nestjs/common';
import { UsersController } from './api/users-controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { SecurityDevicesQueryRepository } from './infrastructure/query/security-devices.query-repository';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { UsersExternalQueryRepository } from './infrastructure/external-query/users.external-query-repository';
import { UsersExternalService } from './application/users.external-service';
import { UsersRepository } from './infrastructure/user.repository';
import { AuthController } from './api/auth.controller';
import { SecurityDevicesController } from './api/security-devices.controller';
import { UsersService } from './application/users.service';
import { AuthService } from './application/auth.service';
import { CryptoService } from './application/crypto.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../../config/config-keys';
import { NotificationsModule } from '../notifications/notifications.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { JwtAuthGuard } from './guards/bearer/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,
    // ✅ Passport регистрируется отдельно, не внутри JwtModule
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(CONFIG_KEYS.JWT_SECRET),
        signOptions: { expiresIn: '5m' },
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationsModule,
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthService,
    CryptoService,
    JwtService,
    SecurityDevicesQueryRepository,
    AuthQueryRepository,
    UsersExternalQueryRepository,
    UsersExternalService,
    JwtStrategy, // ✅ стратегия
    JwtAuthGuard, // ✅ guard
  ],
  exports: [
    UsersExternalQueryRepository,
    UsersExternalService,
    PassportModule,
    JwtModule,
    JwtStrategy,
    JwtAuthGuard,
    UsersRepository,
  ],
})
export class UserAccountsModule {}
