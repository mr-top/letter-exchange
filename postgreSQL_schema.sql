CREATE TABLE users (
  id SERIAL NOT NULL UNIQUE,
  username VARCHAR(20) NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  description VARCHAR(500),
  country VARCHAR(2) NOT NULL,
  city TEXT,
  latitude VARCHAR(12),
  longitude VARCHAR(12),
  joined_date DATE NOT NULL DEFAULT NOW(),
  dob DATE,
  accepting_letters BOOLEAN NOT NULL DEFAULT true,
  accepting_friends BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE letters (
  id SERIAL NOT NULL UNIQUE,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  recipient_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  posted_date TIMESTAMP NOT NULL DEFAULT NOW(),
  arrival_date TIMESTAMP NOT NULL DEFAULT NOW(),
  length VARCHAR(6)
);

CREATE TABLE relations (
  id SERIAL NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  friend_id INTEGER NOT NULL REFERENCES users(id),
  confirmed BOOLEAN NOT NULL DEFAULT false,
  restrict BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT confirmed_for_restrict CHECK ((confirmed = false AND (restrict = false or restrict = true)) OR (confirmed = true AND restrict = false))
);

CREATE TABLE reports (
  id SERIAL NOT NULL UNIQUE PRIMARY KEY,
  report TEXT,
  source_id INTEGER NOT NULL REFERENCES users (id),
  target_id INTEGER NOT NULL REFERENCES users (id),
  created_date TIMESTAMP NOT NULL DEFAULT NOW()
);