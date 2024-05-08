CREATE TABLE IF NOT EXISTS keys (
  key_id TEXT PRIMARY KEY UNIQUE,
  user_id TEXT,
  key TEXT,
  private BOOLEAN,
  FOREIGN KEY (key) REFERENCES posts(post_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);