ALTER TABLE users ADD COLUMN is_mini_mod BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE mini_mod_votes (
    user_id UUID not null,
    thing_id UUID not null,
    field VARCHAR(64) not null,
    vote BOOLEAN,
    strike_ups BOOLEAN not null DEFAULT FALSE,
    strike_downs BOOLEAN not null DEFAULT FALSE,
    strike_poster BOOLEAN not null DEFAULT FALSE,
    PRIMARY KEY (thing_id, field, user_id)
);

ALTER TABLE mod_actions DROP COLUMN version;