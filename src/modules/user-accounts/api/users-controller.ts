import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { UserViewDto } from './view-dto/users.view-dto';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { UsersService } from '../application/users.service';
import { ConfigService } from '@nestjs/config';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserViewDto> {
    return this.usersQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get()
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getAll(query);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createUser(
    @Body(new ValidationPipe()) body: CreateUserInputDto,
  ): Promise<UserViewDto> {
    const userId = await this.usersService.createUser(body);

    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BasicAuthGuard)
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
