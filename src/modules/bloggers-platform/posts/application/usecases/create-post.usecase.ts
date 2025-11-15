import { CreatePostDto } from '../../dto/create-post.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/post.entity';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { CreatePostDomainDto } from '../../domain/dto/create-post.domain.dto';

export class CreatePostCommand {
  constructor(public dto: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
  implements ICommandHandler<CreatePostCommand, string>
{
  constructor(
    @InjectModel(Post.name)
    private postModel: PostModelType,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreatePostCommand): Promise<string> {
    console.log('❤️ ExecutePost!!!!!!!');

    const blog = await this.blogsRepository.findById(dto.blogId);
    const blogName = blog!.name;

    const domainDto = new CreatePostDomainDto(dto, dto.blogId, blogName);

    // 🔥 создаём сразу документ в Mongo
    const created = await this.postModel.create(domainDto);

    return created._id.toString();
  }
}
