CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY UNIQUE,
  username TEXT,
  email TEXT,
  password TEXT,
  photo TEXT,
  age TEXT,
  gender TEXT,
  firstName TEXT,
  lastName TEXT,
  keys TEXT,
  status_profile TEXT
);