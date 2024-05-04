CREATE TABLE IF NOT EXISTS likes (
  like_id TEXT PRIMARY KEY UNIQUE,
  user_id TEXT,
  post_id TEXT,
  comment_id TEXT,
  type INTEGER
);