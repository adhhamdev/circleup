-- Create a function that users can call to delete their own account
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current user's ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Delete all user data in the correct order to avoid foreign key conflicts
  
  -- Delete notifications
  DELETE FROM notifications WHERE user_id = current_user_id;
  
  -- Delete payments
  DELETE FROM payments WHERE user_id = current_user_id;
  
  -- Delete payouts
  DELETE FROM payouts WHERE recipient_id = current_user_id;
  
  -- Remove user from cycle memberships
  DELETE FROM cycle_members WHERE user_id = current_user_id;
  
  -- Set created_by to NULL for cycles created by this user (don't delete cycles)
  UPDATE cycles SET created_by = NULL WHERE created_by = current_user_id;
  
  -- Delete from public users table
  DELETE FROM users WHERE id = current_user_id;
  
  -- Finally, delete from auth.users (this should be done by admin)
  -- Note: Regular users cannot delete from auth.users directly
  -- This would need to be handled by a server-side function with elevated privileges
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;
