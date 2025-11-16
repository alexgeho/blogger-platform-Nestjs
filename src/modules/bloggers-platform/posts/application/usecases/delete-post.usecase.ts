import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';

export class DeletePostCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase
  implements ICommandHandler<DeletePostCommand, void>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute({ id }: DeletePostCommand): Promise<void> {
    const entity = await this.postsRepository.findById(id.toString());
    if (!entity) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Post with id ${id} not found`,
      });
    }
    entity.makeDeleted();
    await this.postsRepository.save(entity);
  }
}
