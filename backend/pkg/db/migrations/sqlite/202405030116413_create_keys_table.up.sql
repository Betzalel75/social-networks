CREATE TABLE IF NOT EXISTS keys (
  key_id TEXT PRIMARY KEY UNIQUE,
  user_id TEXT,
  key TEXT,
  private BOOLEAN
);