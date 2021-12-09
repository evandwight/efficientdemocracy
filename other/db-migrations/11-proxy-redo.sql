
CREATE TABLE in_sample (
    sample_id UUID not null,
    user_id UUID not null,
    proxy_id UUID,
    PRIMARY KEY (sample_id, user_id)
);

ALTER TABLE sample_votes DROP COLUMN in_sample;
ALTER TABLE sample_votes DROP COLUMN has_voted;