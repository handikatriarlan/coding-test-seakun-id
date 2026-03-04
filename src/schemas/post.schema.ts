import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string',
      })
      .min(1, 'Title cannot be empty')
      .max(255, 'Title cannot exceed 255 characters')
      .trim(),
    content: z
      .string({
        required_error: 'Content is required',
        invalid_type_error: 'Content must be a string',
      })
      .min(1, 'Content cannot be empty')
      .trim(),
    slug: z.string({
      required_error: 'Slug is required',
      invalid_type_error: 'Slug must be a string',
    }),
  }),
});

export const updatePostSchema = z.object({
  body: z
    .object({
      title: z
        .string({
          invalid_type_error: 'Title must be a string',
        })
        .min(1, 'Title cannot be empty')
        .max(255, 'Title cannot exceed 255 characters')
        .trim()
        .optional(),
      content: z
        .string({
          invalid_type_error: 'Content must be a string',
        })
        .min(1, 'Content cannot be empty')
        .trim()
        .optional(),
      slug: z
        .string({
          invalid_type_error: 'Slug must be a string',
        })
        .optional(),
    })
    .refine((data) => data.title !== undefined || data.content !== undefined, {
      message: 'At least one field (title or content) must be provided',
    }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a valid number'),
  }),
});

export const getPostByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a valid number'),
  }),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().int().positive('Page must be a positive integer')),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .pipe(
        z
          .number()
          .int()
          .positive('Limit must be a positive integer')
          .max(100, 'Limit cannot exceed 100')
      ),
  }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>['body'];
export type UpdatePostInput = z.infer<typeof updatePostSchema>['body'];
export type PaginationInput = z.infer<typeof paginationSchema>['query'];
