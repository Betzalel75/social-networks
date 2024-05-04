CREATE TABLE IF NOT EXISTS messages (
  message_id TEXT PRIMARY KEY UNIQUE,
  sender_id TEXT,
  receiver_id TEXT,
  content TEXT,
  sender_name TEXT,
  created_at DATETIME,
  vu BOOLEAN
);