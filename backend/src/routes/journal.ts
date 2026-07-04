import { Router } from 'express';
import { pool } from '../db.js';

export const journalRouter = Router();

// دریافت تمام یادآوری‌ها
journalRouter.get('/', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        je.id, 
        je.title, 
        je.reflection, 
        je.mood, 
        je.weather, 
        je.location,
        je.created_at AS "createdAt",
        je.updated_at AS "updatedAt",
        json_agg(DISTINCT jsonb_build_object('id', a.id, 'type', a.type, 'uri', a.uri, 'mimeType', a.mime_type)) FILTER (WHERE a.id IS NOT NULL) as attachments,
        json_agg(DISTINCT t.tag) FILTER (WHERE t.tag IS NOT NULL) as tags
      FROM journal_entries je
      LEFT JOIN attachments a ON je.id = a.journal_entry_id
      LEFT JOIN tags t ON je.id = t.journal_entry_id
      GROUP BY je.id
      ORDER BY je.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Unable to fetch journal entries' });
  }
});

// دریافت یک یادآوری خاص
journalRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        je.id, 
        je.title, 
        je.reflection, 
        je.mood, 
        je.weather, 
        je.location,
        je.created_at AS "createdAt",
        je.updated_at AS "updatedAt",
        json_agg(DISTINCT jsonb_build_object('id', a.id, 'type', a.type, 'uri', a.uri, 'mimeType', a.mime_type)) FILTER (WHERE a.id IS NOT NULL) as attachments,
        json_agg(DISTINCT t.tag) FILTER (WHERE t.tag IS NOT NULL) as tags
      FROM journal_entries je
      LEFT JOIN attachments a ON je.id = a.journal_entry_id
      LEFT JOIN tags t ON je.id = t.journal_entry_id
      WHERE je.id = $1
      GROUP BY je.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ error: 'Unable to fetch journal entry' });
  }
});

// ایجاد یادآوری جدید
journalRouter.post('/', async (req, res) => {
  const { title, reflection, mood, weather, location, attachments, tags } = req.body;

  if (!title || !reflection || !mood) {
    return res.status(400).json({ error: 'Missing required fields: title, reflection, mood' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // ایجاد یادآوری
    const entryResult = await client.query(
      'INSERT INTO journal_entries (title, reflection, mood, weather, location) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [title, reflection, mood, weather || null, location || null]
    );

    const entryId = entryResult.rows[0].id;

    // اضافه کردن پیوست‌ها
    if (attachments && Array.isArray(attachments)) {
      for (const attachment of attachments) {
        await client.query(
          'INSERT INTO attachments (journal_entry_id, type, uri, mime_type) VALUES ($1, $2, $3, $4)',
          [entryId, attachment.type, attachment.uri, attachment.mimeType || null]
        );
      }
    }

    // اضافه کردن برچسب‌ها
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        await client.query(
          'INSERT INTO tags (journal_entry_id, tag) VALUES ($1, $2)',
          [entryId, tag]
        );
      }
    }

    await client.query('COMMIT');

    // دریافت کل داده
    const fullEntryResult = await pool.query(
      `SELECT 
        je.id, 
        je.title, 
        je.reflection, 
        je.mood, 
        je.weather, 
        je.location,
        je.created_at AS "createdAt",
        je.updated_at AS "updatedAt",
        json_agg(DISTINCT jsonb_build_object('id', a.id, 'type', a.type, 'uri', a.uri, 'mimeType', a.mime_type)) FILTER (WHERE a.id IS NOT NULL) as attachments,
        json_agg(DISTINCT t.tag) FILTER (WHERE t.tag IS NOT NULL) as tags
      FROM journal_entries je
      LEFT JOIN attachments a ON je.id = a.journal_entry_id
      LEFT JOIN tags t ON je.id = t.journal_entry_id
      WHERE je.id = $1
      GROUP BY je.id`,
      [entryId]
    );

    res.status(201).json(fullEntryResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating journal entry:', error);
    res.status(500).json({ error: 'Unable to create journal entry' });
  } finally {
    client.release();
  }
});

// به‌روزرسانی یادآوری
journalRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, reflection, mood, weather, location } = req.body;

  try {
    const result = await pool.query(
      `UPDATE journal_entries 
       SET title = COALESCE($1, title), 
           reflection = COALESCE($2, reflection), 
           mood = COALESCE($3, mood), 
           weather = COALESCE($4, weather), 
           location = COALESCE($5, location),
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, title, reflection, mood, weather, location, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [title || null, reflection || null, mood || null, weather || null, location || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ error: 'Unable to update journal entry' });
  }
});

// حذف یادآوری
journalRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM journal_entries WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json({ message: 'Journal entry deleted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ error: 'Unable to delete journal entry' });
  }
});

// فیلتر یادآوری‌ها بر اساس حالت روحی
journalRouter.get('/mood/:mood', async (req, res) => {
  const { mood } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        je.id, 
        je.title, 
        je.reflection, 
        je.mood, 
        je.weather, 
        je.location,
        je.created_at AS "createdAt",
        je.updated_at AS "updatedAt"
      FROM journal_entries je
      WHERE je.mood = $1
      ORDER BY je.created_at DESC`,
      [mood]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching entries by mood:', error);
    res.status(500).json({ error: 'Unable to fetch entries' });
  }
});
