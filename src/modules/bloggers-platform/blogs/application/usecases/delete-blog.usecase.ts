import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';

export class DeleteBlogCommand {
  constructor(public id: Types.ObjectId) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase
  implements ICommandHandler<DeleteBlogCommand, void>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ id }: DeleteBlogCommand): Promise<void> {
    const entity = await this.blogsRepository.findById(id.toString());

    if (!entity) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Blog with id ${id.toString()} not found`,
      });
    }

    entity.makeDeleted();

    await this.blogsRepository.save(entity);
  }
}
