CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY UNIQUE,
  user_id TEXT,
  ttl DATETIME
);