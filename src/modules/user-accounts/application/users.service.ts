import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import type { UserModelType } from '../domain/user.entity';
import bcrypt from 'bcrypt';
import { UsersRepository } from '../infrastructure/user.repository';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../../notifications/email.service';
import { EmailResendDto } from '../api/input-dto/email-resend.dto';
import {
  DomainException,
  Extension,
} from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { ConfirmationCode } from '../api/input-dto/confirmation-code';

@Injectable()
export class UsersService {
  constructor(
    //инжектирование модели в сервис через DI
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private emailService: EmailService,
  ) {}

  async registrationConfirmation(code: ConfirmationCode) {
    const user = await this.usersRepository.findUserByCode(code.code);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Validation failed',
        extensions: [new Extension(`user not exists`, 'user')],
      });
    }

    if (user.isEmailConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.ValidationError,
        message: 'Validation failed',
        extensions: [new Extension(`user already confirmed`, 'user')],
      });
    }
    user.setConfirmed();
    await this.usersRepository.save(user);
  }

  async emailResending(dto: EmailResendDto): Promise<void> {
    const userExist = await this.usersRepository.findByEmail(dto);
    if (!userExist) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Validation failed',
        extensions: [new Extension(`email not exists`, 'email')],
      });
    }

    if (userExist.isEmailConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.ValidationError,
        message: 'Validation failed',
        extensions: [new Extension(`user already confirmed`, 'user')],
      });
    }
    const confirmCode = uuidv4();
    userExist.setConfirmationCode(confirmCode);

    this.emailService
      .sendConfirmationEmail(userExist.email, confirmCode)
      .catch(console.error);
  }

  async createUser(dto: CreateUserDto): Promise<string> {
    const existingUser = await this.usersRepository.findByCreateUserDto(dto);
    console.log('existingUser:::::::::::', existingUser);
    if (existingUser) {
      const field = existingUser.email === dto.email ? 'email' : 'login';
      throw new DomainException({
        code: DomainExceptionCode.ValidationError,
        message: 'Validation failed',
        extensions: [new Extension(`${field} already exists`, field)],
      });
    }

    //TODO: move to bcrypt service
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash,
    });

    await this.usersRepository.save(user);

    return user._id.toString();
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<string> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
        extensions: [new Extension('User not found', 'id')],
      });
    }
    user.update(dto);

    await this.usersRepository.save(user);

    return user._id.toString();
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
        extensions: [new Extension('User not found', 'id')],
      });
    }

    user.makeDeleted();

    await this.usersRepository.save(user);
  }

  async registration(dto: CreateUserDto) {
    const createdUserId = await this.createUser(dto);

    const confirmCode = uuidv4();

    const user = await this.usersRepository.findById(createdUserId);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
        extensions: [new Extension('User not found', 'id')],
      });
    }

    user.setConfirmationCode(confirmCode);
    await this.usersRepository.save(user);
    this.emailService
      .sendConfirmationEmail(user.email, confirmCode)
      .catch(console.error);
  }
}
