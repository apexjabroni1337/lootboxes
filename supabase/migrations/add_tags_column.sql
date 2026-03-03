-- ============================================================
-- Migration: Add tags column to games table
-- Run this in Supabase SQL Editor BEFORE running the seed script
-- ============================================================

-- Add tags column for mobile, multi_system, and secondary system indicators
ALTER TABLE games ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create index for tag-based filtering
CREATE INDEX IF NOT EXISTS idx_games_tags ON games USING GIN (tags);

-- Verify column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'games' AND column_name = 'tags';
