CREATE TABLE IF NOT EXISTS group_posts (
  post_id TEXT PRIMARY KEY UNIQUE,
  user_id TEXT,
  group_id TEXT,
  title TEXT,
  content TEXT,
  image TEXT,
  likeCount INTEGER,
  dislikeCount INTEGER,
  commentCount INTEGER,
  created_at DATETIME,
  private BOOLEAN,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (group_id) REFERENCES groups(group_id)
);