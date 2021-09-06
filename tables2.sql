DROP TABLE users;
DROP TABLE votes CASCADE;
DROP TABLE mod_votes;
DROP TABLE qposts;
DROP TABLE mod_actions;
DROP TABLE strikes;
DROP TABLE disputes;
DROP TABLE samples;
DROP TABLE sample_votes;

CREATE TABLE users (
    id UUID primary key,
    user_name VARCHAR(64) UNIQUE not null,
    name VARCHAR (64) not null,
    password text not null,
    created_on TIMESTAMP with time zone not null,
    email VARCHAR(200) UNIQUE not null,
    is_mod BOOLEAN not null DEFAULT FALSE,
    is_banned BOOLEAN not null DEFAULT FALSE,
    strike_count INT not null DEFAULT 0
);

CREATE TABLE votes (
    thing_id UUID not null,
    user_id UUID not null,
    vote INT not null,
    PRIMARY KEY (thing_id, user_id)
);

CREATE TABLE things (
    id UUID PRIMARY KEY,
    type int not null
);

CREATE TABLE mod_votes (
    user_id UUID PRIMARY KEY,
    vote UUID not null
);

CREATE TABLE qposts (
    id UUID PRIMARY KEY,
    user_id UUID,
    title TEXT not null,
    url TEXT,
    content TEXT,
    created TIMESTAMP with time zone not null,
    hackernews_id  INT UNIQUE,
    hackernews_points INT
);
--CREATE INDEX idx_qposts_hackernews_id ON qposts(hackernews_id);

CREATE TABLE mod_actions (
    id UUID UNIQUE not null,
    thing_id UUID not null,
    field VARCHAR(64) not null,
    creator_id UUID not null,
    expiry TIMESTAMP with time zone not null,
    priority INT not null DEFAULT 0,
    value BOOLEAN not null DEFAULT FALSE,
    version INT not null DEFAULT 1,

    PRIMARY KEY (thing_id, field)
);


CREATE TABLE strikes (
    mod_action_id UUID not null,
    user_id UUID not null,
    PRIMARY KEY (mod_action_id, user_id)
);

CREATE TABLE disputes (
    thing_id UUID not null,
    field VARCHAR(64) not null,
    user_id UUID not null,
    should_be BOOLEAN not null,
    PRIMARY KEY (thing_id, field, user_id)
);


CREATE TABLE samples (
    id UUID PRIMARY KEY,
    samplee_id UUID not null,
    field VARCHAR(64) not null,
    type INT not null,
    expires TIMESTAMP with time zone not null,
    is_complete BOOLEAN not null DEFAULT FALSE,
    result JSONB,
    counts JSONB,
    UNIQUE (samplee_id, field, type)
);

CREATE TABLE sample_votes (
    sample_id UUID not null,
    user_id UUID not null,
    has_voted BOOLEAN not null DEFAULT FALSE,
    vote BOOLEAN,
    strike_ups BOOLEAN not null DEFAULT FALSE,
    strike_downs BOOLEAN not null DEFAULT FALSE,
    strike_poster BOOLEAN not null DEFAULT FALSE,
    strike_disputers BOOLEAN not null DEFAULT FALSE,
    PRIMARY KEY (sample_id, user_id)
);

ALTER TABLE users ALTER COLUMN name DROP NOT NULL;
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
ALTER TABLE users ADD COLUMN auth_type INT NOT NULL DEFAULT 0;
-- ALTER TABLE users ADD COLUMN auth_info JSONB;
ALTER TABLE users ADD COLUMN google_id VARCHAR(64) UNIQUE;
ALTER TABLE users ADD COLUMN first_run BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN send_emails BOOLEAN DEFAULT false;


-- Version 3
ALTER TABLE users ADD COLUMN unsubscribe_key UUID; 
CREATE INDEX idx_users_unsubscribe_key ON users(unsubscribe_key);
-- run src/scripts/setAllUserUnsubscribeKey.ts
ALTER TABLE users ALTER COLUMN unsubscribe_key SET NOT NULL; 

-- ALTER TABLE table_name ADD COLUMN new_column_name data_type constraint DEFAULT FALSE;
-- ALTER TABLE table_name DROP COLUMN column_name;

-- votes.vote = C.VOTE.UP and C.VOTE.DOWN
-- things.type = C.THINGS.QPOST
CREATE MATERIALIZED VIEW vote_count AS
SELECT 
    COALESCE(up_vote_count.thing_id, down_vote_count.thing_id) as id,
    COALESCE(up_votes_nullable, 0) as up_votes,
    COALESCE(down_votes_nullable, 0) as down_votes
FROM 
(SELECT thing_id, count(*) as up_votes_nullable FROM votes WHERE votes.vote = 2 GROUP BY thing_id) as up_vote_count
FULL JOIN (SELECT thing_id, count(*) as down_votes_nullable FROM votes WHERE votes.vote = 0 GROUP BY thing_id) as down_vote_count ON  up_vote_count.thing_id = down_vote_count.thing_id;