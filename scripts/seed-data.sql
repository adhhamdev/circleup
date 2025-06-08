-- Insert sample users
INSERT INTO users (id, full_name, contact_number, password_hash) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sophia Carter', '+1234567890', '$2b$10$example_hash_1'),
('550e8400-e29b-41d4-a716-446655440002', 'Liam Harper', '+1234567891', '$2b$10$example_hash_2'),
('550e8400-e29b-41d4-a716-446655440003', 'Olivia Bennett', '+1234567892', '$2b$10$example_hash_3'),
('550e8400-e29b-41d4-a716-446655440004', 'Noah Carter', '+1234567893', '$2b$10$example_hash_4'),
('550e8400-e29b-41d4-a716-446655440005', 'Ava Mitchell', '+1234567894', '$2b$10$example_hash_5');

-- Insert sample cycles
INSERT INTO cycles (id, name, description, contribution_amount, duration_months, max_members, created_by) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Savings Circle', 'Monthly savings group for building emergency funds', 100.00, 12, 10, '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'Investment Group', 'Higher contribution group for investment purposes', 250.00, 12, 8, '550e8400-e29b-41d4-a716-446655440002');

-- Insert cycle members
INSERT INTO cycle_members (cycle_id, user_id, payout_order) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 4),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 1),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 2),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 3),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 5);

-- Insert sample payments
INSERT INTO payments (cycle_id, user_id, round_number, amount, due_date, paid_date, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 1, 100.00, '2024-01-15', '2024-01-15', 'paid'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 2, 100.00, '2024-02-15', '2024-02-15', 'paid'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 3, 100.00, '2024-03-15', NULL, 'pending');

-- Insert sample payouts
INSERT INTO payouts (cycle_id, recipient_id, round_number, amount, scheduled_date, paid_date, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 1, 1000.00, '2024-01-31', '2024-01-31', 'completed'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 2, 1000.00, '2024-02-29', NULL, 'scheduled'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 3, 1000.00, '2024-03-31', NULL, 'scheduled');
