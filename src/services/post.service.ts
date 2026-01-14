import { query } from '../config/database.js';
import { Post, CreatePostDTO, UpdatePostDTO, PaginatedResponse } from '../types/index.js';
import { calculatePagination } from '../utils/response.js';
import { ApiError } from '../utils/ApiError.js';

export class PostService {
  /**
   * Get all posts with pagination
   * @param page - Page number (1-indexed)
   * @param limit - Number of items per page
   * @returns Paginated response with posts
   */
  async getAllPosts(page: number, limit: number): Promise<PaginatedResponse<Post>> {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get total count for pagination metadata
    const countResult = await query<{ count: string }>('SELECT COUNT(*) as count FROM posts');
    const totalItems = parseInt(countResult.rows[0].count, 10);

    // Get paginated posts ordered by newest first
    const result = await query<Post>(
      `SELECT id, title, content, created_at, updated_at 
       FROM posts 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const pagination = calculatePagination(page, limit, totalItems);

    return {
      data: result.rows,
      pagination,
    };
  }

  /**
   * Get a single post by ID
   * @param id - Post ID
   * @returns Post if found
   * @throws ApiError if post not found
   */
  async getPostById(id: number): Promise<Post> {
    const result = await query<Post>(
      'SELECT id, title, content, created_at, updated_at FROM posts WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound(`Post with id ${id} not found`, 'POST_NOT_FOUND');
    }

    return result.rows[0];
  }

  /**
   * Create a new post
   * @param data - Post creation data
   * @returns Created post
   */
  async createPost(data: CreatePostDTO): Promise<Post> {
    const result = await query<Post>(
      `INSERT INTO posts (title, content) 
       VALUES ($1, $2) 
       RETURNING id, title, content, created_at, updated_at`,
      [data.title, data.content]
    );

    return result.rows[0];
  }

  /**
   * Update an existing post
   * @param id - Post ID
   * @param data - Update data
   * @returns Updated post
   * @throws ApiError if post not found
   */
  async updatePost(id: number, data: UpdatePostDTO): Promise<Post> {
    // First check if post exists
    await this.getPostById(id);

    // Build dynamic update query
    const updates: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      values.push(data.title);
      paramIndex++;
    }

    if (data.content !== undefined) {
      updates.push(`content = $${paramIndex}`);
      values.push(data.content);
      paramIndex++;
    }

    values.push(id);

    const result = await query<Post>(
      `UPDATE posts 
       SET ${updates.join(', ')} 
       WHERE id = $${paramIndex} 
       RETURNING id, title, content, created_at, updated_at`,
      values
    );

    return result.rows[0];
  }

  /**
   * Delete a post by ID
   * @param id - Post ID
   * @throws ApiError if post not found
   */
  async deletePost(id: number): Promise<void> {
    const result = await query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      throw ApiError.notFound(`Post with id ${id} not found`, 'POST_NOT_FOUND');
    }
  }
}

// Export singleton instance
export const postService = new PostService();
