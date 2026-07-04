-- ایجاد جداول پایگاه داده

CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  template_id VARCHAR(100) NOT NULL,
  duration INTEGER NOT NULL,
  thumbnail_uri TEXT NOT NULL,
  content_base64 TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  reflection TEXT NOT NULL,
  mood VARCHAR(50) NOT NULL,
  weather VARCHAR(100),
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  journal_entry_id INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  uri TEXT NOT NULL,
  mime_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  journal_entry_id INTEGER NOT NULL,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE
);

CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at DESC);
CREATE INDEX idx_journal_entries_mood ON journal_entries(mood);
CREATE INDEX idx_attachments_journal_id ON attachments(journal_entry_id);
CREATE INDEX idx_tags_journal_id ON tags(journal_entry_id);
