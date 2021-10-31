ALTER TABLE users ADD COLUMN wants_mod BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE mod_votes (
    user_id UUID PRIMARY KEY,
    vote UUID
);