-- Initialize database for Learn By Doing application

-- Create extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables if they don't exist yet
-- Note: The actual table creation will be handled by SQLAlchemy and Alembic migrations
-- This file is mainly for initial database setup and seeding

-- Create initial admin user if needed
-- INSERT INTO users (email, username, hashed_password, is_active)
-- VALUES ('admin@example.com', 'admin', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', true)
-- ON CONFLICT DO NOTHING;

-- Sample data will be added through the API after deployment
