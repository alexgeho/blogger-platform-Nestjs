import { IsEnum, IsNotEmpty } from 'class-validator';
import { LikeStatus } from '../domain/like-status.enum';

export class LikeStatusInputDto {
  @IsNotEmpty()
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
