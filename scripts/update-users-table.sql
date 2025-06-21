-- Update users table to use email instead of contact_number
ALTER TABLE users 
DROP COLUMN IF EXISTS contact_number,
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Update existing records if any
UPDATE users 
SET email = COALESCE(
  (SELECT email FROM auth.users WHERE auth.users.id = users.id),
  'unknown@example.com'
)
WHERE email IS NULL;

-- Add unique constraint on email
ALTER TABLE users 
ADD CONSTRAINT users_email_unique UNIQUE (email);
