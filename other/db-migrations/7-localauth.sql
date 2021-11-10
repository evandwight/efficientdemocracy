ALTER TABLE users ADD COLUMN email_state INT;
UPDATE users SET email_state = 100;
ALTER TABLE users ALTER COLUMN email_state SET NOT NULL;
ALTER TABLE users ALTER COLUMN email_state SET DEFAULT 0; 
