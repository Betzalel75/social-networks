CREATE TABLE IF NOT EXISTS event_members (
  event_member_id TEXT PRIMARY KEY UNIQUE,
  event_id TEXT,
  user_id TEXT,
  FOREIGN KEY (event_id) REFERENCES event(event_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);