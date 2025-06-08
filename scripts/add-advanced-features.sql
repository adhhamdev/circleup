-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
    invited_by UUID REFERENCES users(id) ON DELETE CASCADE,
    invite_code VARCHAR(10) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table for chat functionality
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table for tracking cycle performance
CREATE TABLE IF NOT EXISTS cycle_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
    total_contributions DECIMAL(12,2) DEFAULT 0,
    payment_rate DECIMAL(5,2) DEFAULT 0,
    active_members INTEGER DEFAULT 0,
    completed_rounds INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invitations_cycle_id ON invitations(cycle_id);
CREATE INDEX IF NOT EXISTS idx_invitations_invite_code ON invitations(invite_code);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
CREATE INDEX IF NOT EXISTS idx_messages_cycle_id ON messages(cycle_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_cycle_analytics_cycle_id ON cycle_analytics(cycle_id);

-- Insert sample invitations
INSERT INTO invitations (cycle_id, invited_by, invite_code, email, expires_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'ABC123', 'friend@example.com', NOW() + INTERVAL '7 days'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'XYZ789', 'another@example.com', NOW() + INTERVAL '7 days');

-- Insert sample messages
INSERT INTO messages (cycle_id, user_id, message) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Welcome everyone to our savings circle!'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Thanks for organizing this, Liam!'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Looking forward to saving together 💪');

-- Insert sample analytics
INSERT INTO cycle_analytics (cycle_id, total_contributions, payment_rate, active_members, completed_rounds) VALUES
('660e8400-e29b-41d4-a716-446655440001', 1500.00, 95.5, 5, 3);

-- Create function to update analytics automatically
CREATE OR REPLACE FUNCTION update_cycle_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update analytics when payments are made
    IF TG_TABLE_NAME = 'payments' AND NEW.status = 'paid' THEN
        INSERT INTO cycle_analytics (cycle_id, total_contributions, active_members, last_updated)
        VALUES (NEW.cycle_id, NEW.amount, 1, NOW())
        ON CONFLICT (cycle_id) 
        DO UPDATE SET 
            total_contributions = cycle_analytics.total_contributions + NEW.amount,
            last_updated = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic analytics updates
DROP TRIGGER IF EXISTS trigger_update_analytics ON payments;
CREATE TRIGGER trigger_update_analytics
    AFTER UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_cycle_analytics();
