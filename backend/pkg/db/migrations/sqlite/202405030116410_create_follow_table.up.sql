CREATE TABLE IF NOT EXISTS follow (
  follow_id TEXT PRIMARY KEY UNIQUE,
  user_id TEXT,
  followed_user TEXT,
  follow_type TEXT
);