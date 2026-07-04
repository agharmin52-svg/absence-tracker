import express from 'express';
import cors from 'cors';
import { json } from 'express';
import dotenv from 'dotenv';
import { initDatabase, checkDatabaseConnection, closePool } from './db.js';
import { videoRouter } from './routes/videos.js';
import { journalRouter } from './routes/journal.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(json({ limit: '20mb' }));

// Health check endpoint
app.get('/health', async (_req, res) => {
  const dbConnected = await checkDatabaseConnection();
  res.json({ 
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/videos', videoRouter);
app.use('/api/journal', journalRouter);

// خطای 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// شروع سرور
async function start() {
  try {
    await initDatabase();
    
    const server = app.listen(port, () => {
      console.log(`\n✓ API server listening on http://localhost:${port}`);
      console.log(`✓ Health check: http://localhost:${port}/health\n`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('\nSIGTERM received, shutting down gracefully...');
      server.close(async () => {
        await closePool();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

start();
