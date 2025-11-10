import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { UpdateBlogInputDto } from '../../dto/update-blog.input-dto';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';

export class UpdateBlogCommand {
  constructor(
    public id: Types.ObjectId,
    public dto: UpdateBlogInputDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase
  implements ICommandHandler<UpdateBlogCommand, void>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ id, dto }: UpdateBlogCommand): Promise<void> {
    // 1️⃣ Находим блог или выбрасываем исключение
    const entity = await this.blogsRepository.findById(id.toString());

    if (!entity) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Blog with id ${id.toString()} not found`,
      });
    }
    entity.update(dto);

    await this.blogsRepository.save(entity);
  }
}
