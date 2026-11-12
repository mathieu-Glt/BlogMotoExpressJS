CREATE TABLE author (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname  VARCHAR(50) NOT NULL
);

CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL
);

CREATE TABLE post (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  contents TEXT NOT NULL,
  author_id  INT NOT NULL REFERENCES author(id),
  categry_id INT NOT NULL REFERENCES category(id)
);

CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  nickname VARCHAR(30) NOT NULL,
  contents TEXT NOT NULL,
  creationtimestamp DATE NOT NULL,
  post_id INT NOT NULL REFERENCES post(id) ON DELETE CASCADE
);

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(120) NOT NULL,
  role VARCHAR(10) NOT NULL,
  firstname VARCHAR(60) NOT NULL,
  lastname  VARCHAR(60) NOT NULL
);