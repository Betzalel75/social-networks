CREATE TABLE IF NOT EXISTS categories (
  category_id TEXT PRIMARY KEY UNIQUE,
  post_id TEXT,
  name TEXT
);