import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { UpdateBlogInputDto } from '../../dto/update-blog.input-dto';

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
    const entity = await this.blogsRepository.findOrNotFoundFail(id.toString());

    console.log('Before update:', {
      name: entity.name,
      description: entity.description,
      websiteUrl: entity.websiteUrl,
    });

    // 2️⃣ Обновляем данные через доменный метод
    entity.update(dto);

    console.log('After update:', {
      name: entity.name,
      description: entity.description,
      websiteUrl: entity.websiteUrl,
    });

    // 3️⃣ Сохраняем обновлённый документ
    await this.blogsRepository.save(entity);
  }
}
