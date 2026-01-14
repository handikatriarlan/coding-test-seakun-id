import { Router, Request, Response } from 'express';
import postRoutes from './post.routes.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Blog Post API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.use('/posts', postRoutes);

export default router;
