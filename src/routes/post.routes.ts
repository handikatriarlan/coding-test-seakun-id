import { Router } from 'express';
import { postController } from '../controllers/post.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createPostSchema,
  updatePostSchema,
  getPostByIdSchema,
  paginationSchema,
} from '../schemas/post.schema.js';

const router = Router();

/**
 * @route   GET /posts
 * @desc    Get all posts with pagination
 * @access  Public
 * @query   page (optional) - Page number (default: 1)
 * @query   limit (optional) - Items per page (default: 10, max: 100)
 */
router.get(
  '/',
  validate(paginationSchema),
  postController.getAllPosts.bind(postController)
);

/**
 * @route   GET /posts/:id
 * @desc    Get a single post by ID
 * @access  Public
 * @param   id - Post ID
 */
router.get(
  '/:id',
  validate(getPostByIdSchema),
  postController.getPostById.bind(postController)
);

/**
 * @route   POST /posts
 * @desc    Create a new blog post
 * @access  Public
 * @body    { title: string, content: string }
 */
router.post(
  '/',
  validate(createPostSchema),
  postController.createPost.bind(postController)
);

/**
 * @route   PUT /posts/:id
 * @desc    Update an existing blog post
 * @access  Public
 * @param   id - Post ID
 * @body    { title?: string, content?: string }
 */
router.put(
  '/:id',
  validate(updatePostSchema),
  postController.updatePost.bind(postController)
);

/**
 * @route   DELETE /posts/:id
 * @desc    Delete a blog post
 * @access  Public
 * @param   id - Post ID
 */
router.delete(
  '/:id',
  validate(getPostByIdSchema),
  postController.deletePost.bind(postController)
);

export default router;
