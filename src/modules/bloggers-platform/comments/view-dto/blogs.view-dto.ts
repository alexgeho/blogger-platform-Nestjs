import { BlogDocument } from '../domain/blog.entity';

/**
 * View DTO for Blog
 * Used to shape the data returned to clients (no sensitive info)
 */
export class BlogViewDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;

  /**
   * Converts Blog document to BlogViewDto
   * @param {BlogDocument} blog
   * @returns {BlogViewDto}
   */
  static mapToView(blog: BlogDocument): BlogViewDto {
    const dto = new BlogViewDto();

    dto.id = blog._id.toString();
    dto.name = blog.name;
    dto.description = blog.description;
    dto.websiteUrl = blog.websiteUrl;
    dto.createdAt = blog.createdAt ?? new Date();
    dto.isMembership = blog.isMembership;

    return dto;
  }
}
