CREATE TABLE IF NOT EXISTS event (
  event_id TEXT PRIMARY KEY UNIQUE,
  title TEXT,
  description TEXT,
  image TEXT,
  admin TEXT,
  date TEXT,
  group_id TEXT,
  FOREIGN KEY (group_id) REFERENCES groups(group_id)
);