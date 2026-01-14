import { Request, Response, NextFunction } from 'express';
import { postService } from '../services/post.service.js';
import { sendSuccess, sendPaginatedSuccess } from '../utils/response.js';
import { CreatePostInput, UpdatePostInput } from '../schemas/post.schema.js';

export class PostController {
  // Get all posts with pagination
  async getAllPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await postService.getAllPosts(page, limit);

      sendPaginatedSuccess(res, result.data, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  // Get a single post by ID
  async getPostById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const post = await postService.getPostById(id);

      sendSuccess(res, post);
    } catch (error) {
      next(error);
    }
  }

  // Create a new blog post
  async createPost(
    req: Request<object, object, CreatePostInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const post = await postService.createPost(req.body);

      sendSuccess(res, post, 'Post created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  // Update an existing blog post
  async updatePost(
    req: Request<{ id: string }, object, UpdatePostInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const post = await postService.updatePost(id, req.body);

      sendSuccess(res, post, 'Post updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Delete a blog post
  async deletePost(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await postService.deletePost(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const postController = new PostController();
