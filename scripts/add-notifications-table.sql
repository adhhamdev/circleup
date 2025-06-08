-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('payment_due', 'payment_received', 'cycle_update', 'payout_ready')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'payment_due', 'Payment Due Soon', 'Your payment for Savings Circle is due in 2 days'),
('550e8400-e29b-41d4-a716-446655440001', 'cycle_update', 'New Member Joined', 'Sarah Johnson joined your Investment Group'),
('550e8400-e29b-41d4-a716-446655440001', 'payout_ready', 'Payout Available', 'Your payout of $1000 is ready for collection');
