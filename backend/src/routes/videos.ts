import { Router } from 'express';
import { pool } from '../db.js';

export const videoRouter = Router();

// دریافت تمام ویدیوها
videoRouter.get('/', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, file_name AS "fileName", template_id AS "templateId", duration, thumbnail_uri AS "thumbnailUri", created_at AS "createdAt" FROM videos ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Unable to fetch videos' });
  }
});

// دریافت یک ویدیو خاص
videoRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, title, file_name AS "fileName", template_id AS "templateId", duration, thumbnail_uri AS "thumbnailUri", content_base64 AS "contentBase64", created_at AS "createdAt" FROM videos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Unable to fetch video' });
  }
});

// ایجاد ویدیو جدید
videoRouter.post('/', async (req, res) => {
  const { title, fileName, templateId, duration, thumbnailUri, contentBase64 } = req.body;

  if (!title || !fileName || !templateId || !duration || !thumbnailUri || !contentBase64) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO videos (title, file_name, template_id, duration, thumbnail_uri, content_base64) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, file_name AS "fileName", template_id AS "templateId", duration, thumbnail_uri AS "thumbnailUri", created_at AS "createdAt"',
      [title, fileName, templateId, duration, thumbnailUri, contentBase64]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting video:', error);
    res.status(500).json({ error: 'Unable to save video' });
  }
});

// حذف ویدیو
videoRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM videos WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({ message: 'Video deleted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Unable to delete video' });
  }
});

// به‌روزرسانی ویدیو
videoRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE videos SET title = $1, updated_at = NOW() WHERE id = $2 RETURNING id, title, file_name AS "fileName", template_id AS "templateId", duration, thumbnail_uri AS "thumbnailUri", created_at AS "createdAt", updated_at AS "updatedAt"',
      [title, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Unable to update video' });
  }
});
