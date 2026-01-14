import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const createApp = (): Application => {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', routes);
  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'Welcome to Blog Post API',
      version: '1.0.0',
      documentation: '/api/health',
      endpoints: {
        health: 'GET /api/health',
        posts: {
          list: 'GET /api/posts',
          get: 'GET /api/posts/:id',
          create: 'POST /api/posts',
          update: 'PUT /api/posts/:id',
          delete: 'DELETE /api/posts/:id',
        },
      },
    });
  });
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
