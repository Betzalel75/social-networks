CREATE TABLE IF NOT EXISTS comments (
  comment_id TEXT PRIMARY KEY UNIQUE,
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  content TEXT,
  image TEXT
);