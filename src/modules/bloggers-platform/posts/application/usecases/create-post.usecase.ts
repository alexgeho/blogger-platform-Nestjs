import { CreatePostDto } from '../../dto/create-post.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { InjectModel } from '@nestjs/mongoose';
import { PostModelType } from '../../domain/post.entity';
import { Post } from '@nestjs/common';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { CreatePostDomainDto } from '../../domain/dto/create-post.domain.dto';

export class CreatePostCommand {
  constructor(public dto: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
  implements ICommandHandler<CreatePostCommand, Types.ObjectId>
{
  constructor(
    @InjectModel(Post.name)
    private postModel: PostModelType,
    private postRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreatePostCommand): Promise<Types.ObjectId> {
    console.log('❤️ ExecutePost!!!!!!!');
    const blog = await this.blogsRepository.findById(dto.blogId);
    const blogName = blog!.name;

    const domainDto = new CreatePostDomainDto(dto, dto.blogId, blogName);

    const entity = this.postModel.createInstance(domainDto);
    await this.postRepository.save(entity);
    return entity._id;
  }
}
