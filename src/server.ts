import dotenv from 'dotenv';

dotenv.config();

import createApp from './app.js';
import { testConnection, closePool } from './config/database.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async (): Promise<void> => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    const app = createApp();

    const server = app.listen(PORT, () => {
      console.log('Server Configuration:');
      console.log(`   Environment: ${NODE_ENV}`);
      console.log(`   Port: ${PORT}`);
      console.log(`   URL: http://localhost:${PORT}`);
      console.log(`   API Base: http://localhost:${PORT}/api`);
      console.log('');
      console.log('Available Endpoints:');
      console.log('   GET    /api/health     - Health check');
      console.log('   GET    /api/posts      - List all posts');
      console.log('   GET    /api/posts/:id  - Get post by ID');
      console.log('   POST   /api/posts      - Create new post');
      console.log('   PUT    /api/posts/:id  - Update post');
      console.log('   DELETE /api/posts/:id  - Delete post');
    });

    const gracefulShutdown = async (signal: string): Promise<void> => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('HTTP server closed');

        await closePool();
        console.log('Database connections closed');

        console.log('Graceful shutdown completed');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (error: Error) => {
      console.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason: unknown) => {
      console.error('Unhandled Rejection:', reason);
      gracefulShutdown('unhandledRejection');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
