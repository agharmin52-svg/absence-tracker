import { Pool, QueryResult } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

export const pool = new Pool({ connectionString });

export async function initDatabase() {
  const client = await pool.connect();

  try {
    console.log('Initializing database...');

    // خواندن و اجرای فایل schema
    const schemaPath = path.join(__dirname, '../database/001_init_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // تقسیم دستورات SQL با توجه به نقطه‌ویرگول
    const statements = schema
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      try {
        await client.query(statement);
        console.log('✓ Executed:', statement.substring(0, 50) + '...');
      } catch (error) {
        console.error('Error executing statement:', statement.substring(0, 50), error);
      }
    }

    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
}
