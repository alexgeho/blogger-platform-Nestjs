import { UpdatePostInputDto } from '../../dto/update-post.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';

export class UpdatePostCommand {
  constructor(
    public id: string,
    public dto: UpdatePostInputDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase
  implements ICommandHandler<UpdatePostCommand, void>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute({ id, dto }: UpdatePostCommand): Promise<void> {
    const entity = await this.postsRepository.findById(id);
    if (!entity) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Post with id ${id} not found`,
      });
    }
    entity.update(dto);
    await this.postsRepository.save(entity);
  }
}
