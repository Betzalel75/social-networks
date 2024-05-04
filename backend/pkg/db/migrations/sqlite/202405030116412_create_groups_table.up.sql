CREATE TABLE IF NOT EXISTS groups (
  group_id TEXT PRIMARY KEY UNIQUE,
  group_title TEXT,
  group_desc TEXT,
  group_owner TEXT,
  group_users TEXT,
  created_at DATETIME
);
