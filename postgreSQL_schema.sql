CREATE TABLE users (
  id SERIAL NOT NULL UNIQUE,
  username VARCHAR(20) NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  description VARCHAR(500),
  country VARCHAR(2) NOT NULL,
  joined_date DATE NOT NULL DEFAULT NOW(),
  dob DATE
);

CREATE TABLE letters (
  id SERIAL NOT NULL UNIQUE,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  recipient_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  posted_date TIMESTAMP NOT NULL DEFAULT NOW(),
  length VARCHAR(6)
);

CREATE TABLE relations (
  id SERIAL NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  friend_id INTEGER NOT NULL REFERENCES users(id),
  confirmed BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY(user_id, friend_id),
  CONSTRAINT directionless
    FOREIGN KEY (friend_id, user_id)
    REFERENCES relations (user_id, friend_id)
);

INSERT INTO users (username, email, country, password) VALUES 
('number-one', 'one@number.com', 'GB', 'password'),
('number-two', 'two@number.com', 'DE', 'password'),
('number-three', 'three@number.com', 'MN', 'password'),
('number-four', 'four@number.com', 'KR', 'password'),
('number-five', 'five@number.com', 'TR', 'password'),
('number-six', 'six@number.com', 'RU', 'password');

INSERT INTO relations (user_id, friend_id, confirmed) VALUES
(1, 2, true), (2, 1, true),
(1, 3, true), (3, 1, false),
(4, 5, true), (5, 4, true),
(2, 5, true), (5, 2, false),
(5, 1, true), (1, 5, true);

INSERT INTO letters (sender_id, recipient_id, content, length) VALUES
(1, 2, 'Hello! this is my letter to two as i am one', 'short'),
(2, 1, 'Hello! this is my letter to one as i am two', 'short'),
(1, 3, 'Hello! this is my letter to three as i am one', 'medium'),
(4, 5, 'Hello! this is my letter to five as i am four', 'long'),
(1, 5, 'Hello! this is my letter to five as i am one', 'short'),
(5, 1, 'Hello! this is my letter to one as i am five', 'short');