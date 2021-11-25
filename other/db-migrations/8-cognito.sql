ALTER TABLE users DROP CONSTRAINT users_email_key;
ALTER TABLE users DROP CONSTRAINT users_google_id_key;
ALTER TABLE users DROP COLUMN name;
ALTER TABLE users DROP COLUMN password;
ALTER TABLE users DROP COLUMN auth_type;
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users DROP COLUMN google_id;
ALTER TABLE users DROP COLUMN email_state;