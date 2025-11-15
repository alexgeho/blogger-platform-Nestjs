import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/post.entity';
import type { PostModelType } from '../domain/post.entity';
import { CreatePostDomainDto } from '../domain/dto/create-post.domain.dto';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostsViewDto } from '../view-dto/posts.view-dto';
import { CreatePostThroughBlogDto } from '../../blogs/dto/create-post-through-blog.dto';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { LikesService } from '../../likes/application/likes.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
    private likesService: LikesService,
  ) {}

  async getPostById(
    postId: string,
    userId: string | null,
  ): Promise<PostsViewDto> {
    const post = await this.postsRepository.findById(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    // 🔥 передаём parentType = 'Post'
    const extendedLikesInfo = await this.likesService.getExtendedLikesInfo(
      postId,
      userId,
      'Post',
    );

    post.extendedLikesInfo = extendedLikesInfo;

    return PostsViewDto.mapToView(post);
  }

  async deletePost(id: string): Promise<void> {
    const postExist = await this.postsRepository.findOrNotFoundFail(id);
    if (postExist.deletedAt) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    await this.postsRepository.deletePost(postExist);
  }

  async updatePost(id: string, dto: CreatePostDto): Promise<PostsViewDto> {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    post.update(dto);
    await this.postsRepository.save(post);

    return PostsViewDto.mapToView(post);
  }

  async createPost(dto: CreatePostDto): Promise<string> {
    const blog = await this.blogsRepository.findById(dto.blogId);

    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Blog with id ${dto.blogId.toString()} not found`,
      });
    }

    const domainDto = new CreatePostDomainDto(dto, dto.blogId, blog.name);

    const post = this.PostModel.createInstance(domainDto);

    const createdPost = await this.postsRepository.save(post);

    return createdPost._id.toString();
  }

  async CreatePostThroughBlogDto(
    dto: CreatePostThroughBlogDto,
    blogId: string,
  ): Promise<string> {
    const blog = await this.blogsRepository.findById(blogId);

    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: `Blog with id ${blogId.toString()} not found`,
      });
    }

    const domainDto = new CreatePostDomainDto(dto, blogId, blog.name);

    const post = this.PostModel.createInstance(domainDto);

    const createdPost = await this.postsRepository.save(post);

    return createdPost._id.toString(); // ✅ только id
  }
}
