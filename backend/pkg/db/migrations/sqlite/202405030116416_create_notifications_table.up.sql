CREATE TABLE IF NOT EXISTS notifications (
  notification_id TEXT PRIMARY KEY UNIQUE,
  user_id TEXT,
  recever_id TEXT,
  category TEXT,
  type TEXT,
  created_at DATETIME,
  vu BOOLEAN,
  source_id TEXT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (recever_id) REFERENCES users(user_id)
);