-- Add CASCADE DELETE constraints to related tables
-- This ensures that when a user is deleted, all their related data is also deleted

-- Drop existing foreign key constraints and recreate with CASCADE
ALTER TABLE cycle_members 
DROP CONSTRAINT IF EXISTS cycle_members_user_id_fkey,
ADD CONSTRAINT cycle_members_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE payments 
DROP CONSTRAINT IF EXISTS payments_user_id_fkey,
ADD CONSTRAINT payments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE payouts 
DROP CONSTRAINT IF EXISTS payouts_recipient_id_fkey,
ADD CONSTRAINT payouts_recipient_id_fkey 
FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE cycles 
DROP CONSTRAINT IF EXISTS cycles_created_by_fkey,
ADD CONSTRAINT cycles_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- Add cascade delete for notifications table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
        ALTER TABLE notifications 
        DROP CONSTRAINT IF EXISTS notifications_user_id_fkey,
        ADD CONSTRAINT notifications_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;
