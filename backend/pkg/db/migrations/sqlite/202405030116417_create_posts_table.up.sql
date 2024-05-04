CREATE TABLE IF NOT EXISTS posts (
  post_id TEXT PRIMARY KEY UNIQUE,
  user_id TEXT,
  title TEXT,
  content TEXT,
  image TEXT,
  likeCount INTEGER,
  dislikeCount INTEGER,
  commentCount INTEGER,
  created_at DATETIME,
  private BOOLEAN
);