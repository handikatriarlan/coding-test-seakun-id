import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

dotenv.config();

const runMigrations = async (): Promise<void> => {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'blog_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    console.log('Running database migrations...');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Database: ${process.env.DB_NAME || 'blog_db'}`);

    const migrationPath = join(process.cwd(), 'migrations/001_create_posts_table.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    await pool.query(migrationSQL);

    console.log('Migrations completed successfully!');

    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'posts'
      ORDER BY ordinal_position
    `);

    console.log('\nPosts table schema:');
    result.rows.forEach((row: { column_name: string; data_type: string }) => {
      console.log(`   - ${row.column_name}: ${row.data_type}`);
    });

    const countResult = await pool.query('SELECT COUNT(*) as count FROM posts');
    console.log(`\nCurrent posts count: ${countResult.rows[0].count}`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigrations();
