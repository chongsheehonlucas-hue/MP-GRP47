
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,

    username TEXT NOT NULL COLLATE NOCASE UNIQUE
        CHECK (length(username) BETWEEN 3 AND 50),

    email TEXT NOT NULL COLLATE NOCASE UNIQUE
        CHECK (length(email) <= 254),

    password_hash TEXT NOT NULL,

--  MIGHT ADD ADMIN, WILL CONSULT WITH GROUP
    role TEXT NOT NULL DEFAULT 'learner'
        CHECK (role IN ('learner', 'instructor'))
);
