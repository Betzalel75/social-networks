CREATE TABLE IF NOT EXISTS user_key (
  user_id TEXT,
  key_id TEXT,
  PRIMARY KEY (user_id, key_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (key_id) REFERENCES keys(key_id)
);