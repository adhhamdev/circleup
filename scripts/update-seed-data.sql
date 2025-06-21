-- Update seed data to use emails instead of phone numbers
UPDATE users SET 
  email = CASE 
    WHEN full_name = 'John Doe' THEN 'john.doe@example.com'
    WHEN full_name = 'Jane Smith' THEN 'jane.smith@example.com'
    WHEN full_name = 'Mike Johnson' THEN 'mike.johnson@example.com'
    WHEN full_name = 'Sarah Wilson' THEN 'sarah.wilson@example.com'
    WHEN full_name = 'David Brown' THEN 'david.brown@example.com'
    WHEN full_name = 'Lisa Davis' THEN 'lisa.davis@example.com'
    WHEN full_name = 'Tom Miller' THEN 'tom.miller@example.com'
    WHEN full_name = 'Emma Garcia' THEN 'emma.garcia@example.com'
    WHEN full_name = 'Alex Rodriguez' THEN 'alex.rodriguez@example.com'
    WHEN full_name = 'Olivia Martinez' THEN 'olivia.martinez@example.com'
    ELSE email
  END
WHERE email IS NULL OR email = 'unknown@example.com';
