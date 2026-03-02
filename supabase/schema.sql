-- ============================================================
-- Lootboxes.com Database Schema
-- Run this in the Supabase SQL Editor to create all tables
-- ============================================================

-- Games catalog
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_image TEXT,
  platforms TEXT[] DEFAULT '{}',
  genres TEXT[] DEFAULT '{}',
  release_date DATE,
  metacritic INTEGER,
  lootboxes_score NUMERIC(3,1),
  itad_id TEXT, -- IsThereAnyDeal game ID for API lookups
  steam_app_id TEXT, -- Steam app ID for direct API access
  description TEXT, -- Game summary/description from IGDB
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_games_slug ON games(slug);
CREATE INDEX idx_games_itad_id ON games(itad_id);
CREATE INDEX idx_games_steam_app_id ON games(steam_app_id);
CREATE INDEX idx_games_missing_images ON games(id) WHERE cover_image IS NULL;
CREATE INDEX idx_games_missing_itad ON games(id) WHERE itad_id IS NULL;

-- Active deals
CREATE TABLE IF NOT EXISTS deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  store TEXT NOT NULL,
  store_url TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2) NOT NULL,
  discount_pct NUMERIC(5,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  is_historic_low BOOLEAN DEFAULT FALSE,
  affiliate_url TEXT,
  expires_at TIMESTAMPTZ,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, store, price) -- Prevent duplicate deal entries
);

CREATE INDEX idx_deals_game_id ON deals(game_id);
CREATE INDEX idx_deals_store ON deals(store);
CREATE INDEX idx_deals_discount ON deals(discount_pct DESC);
CREATE INDEX idx_deals_scraped ON deals(scraped_at DESC);

-- Price history (for charts)
CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  store TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_history_game ON price_history(game_id, store);
CREATE INDEX idx_price_history_date ON price_history(recorded_at DESC);

-- Analytics article metadata (content lives in MDX files)
CREATE TABLE IF NOT EXISTS analytics_meta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  type TEXT NOT NULL CHECK (type IN ('battlepass', 'lootbox', 'economy', 'droprates')),
  lootboxes_score NUMERIC(3,1),
  cover_image TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_slug ON analytics_meta(slug);
CREATE INDEX idx_analytics_type ON analytics_meta(type);

-- Drop rate database
CREATE TABLE IF NOT EXISTS drop_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  rarity TEXT NOT NULL,
  drop_rate_pct NUMERIC(8,4) NOT NULL,
  source TEXT DEFAULT 'user_reported' CHECK (source IN ('official', 'community_verified', 'user_reported')),
  verified BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drop_rates_game ON drop_rates(game_id);

-- Affiliate click tracking
CREATE TABLE IF NOT EXISTS clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clicks_deal ON clicks(deal_id);
CREATE INDEX idx_clicks_date ON clicks(created_at DESC);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  confirmed BOOLEAN DEFAULT FALSE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_subscribers_email ON subscribers(email);

-- ============================================================
-- Row Level Security Policies
-- ============================================================

-- Games: public read, admin write
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Games are viewable by everyone" ON games FOR SELECT USING (true);

-- Deals: public read, service role write
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deals are viewable by everyone" ON deals FOR SELECT USING (true);

-- Price history: public read
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Price history is viewable by everyone" ON price_history FOR SELECT USING (true);

-- Analytics: public read
ALTER TABLE analytics_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Analytics are viewable by everyone" ON analytics_meta FOR SELECT USING (true);

-- Drop rates: public read
ALTER TABLE drop_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Drop rates are viewable by everyone" ON drop_rates FOR SELECT USING (true);

-- Clicks: service role only (no public access)
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- Subscribers: service role only
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper function: update the updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER games_updated_at BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER analytics_updated_at BEFORE UPDATE ON analytics_meta
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
