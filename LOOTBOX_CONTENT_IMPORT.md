# Lootbox Content Insertion Guide

## Overview
This document describes how to insert the 12 remaining lootbox content records into the database.

## Generated Files

### 1. seed-lootbox-content.sql
Contains 12 SQL INSERT statements for the following games:
- genshin-impact
- honkai-star-rail
- ea-fc-25
- overwatch-2
- apex-legends
- diablo-4
- fortnite
- rocket-league
- valorant
- pokemon-tcg-pocket
- marvel-snap
- zenless-zone-zero

Counter-Strike 2 is excluded (already inserted).

## How to Use

### Option 1: Using SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `seed-lootbox-content.sql`
4. Paste into the SQL Editor
5. Click "Run" button

### Option 2: Using Supabase CLI

```bash
# Set the correct working directory
cd /sessions/optimistic-gallant-gauss/mnt/Desktop/lootboxes

# Run the SQL file
supabase db execute seed-lootbox-content.sql
```

### Option 3: Using Node.js Script

Update the `.env.local` file with your actual Supabase service role key, then run:

```bash
# From the project directory
cd /sessions/optimistic-gallant-gauss/mnt/Desktop/lootboxes
node insert-lootbox-content.js
```

## SQL Statements Details

Each INSERT statement includes:
- Game ID (looked up by slug from games table)
- All pricing information (cost_per_pull, cost_to_pity, pulls_to_pity)
- Pity system flag
- Currency information
- All scoring metrics (transparency, value, fairness, player_control)
- Comparable game slugs (as arrays)
- HTML content for:
  - Overview
  - Pity explanation
  - History
  - Controversy
  - Tips
  - Editorial

### Key Features:
- Single quotes in HTML content are properly escaped ('' in SQL)
- Uses ON CONFLICT (game_id) DO NOTHING to prevent duplicates
- Uses SELECT subquery to look up game_id by slug
- All data sourced from the TypeScript seed file

## Data Integrity

Before running the SQL:

1. Verify all 13 games exist in the `games` table:
   ```sql
   SELECT COUNT(*) FROM games WHERE slug IN (
     'counter-strike-2', 'genshin-impact', 'honkai-star-rail', 
     'ea-fc-25', 'overwatch-2', 'apex-legends', 'diablo-4', 
     'fortnite', 'rocket-league', 'valorant', 
     'pokemon-tcg-pocket', 'marvel-snap', 'zenless-zone-zero'
   );
   ```

2. Check current lootbox_content records:
   ```sql
   SELECT game_id, COUNT(*) as record_count FROM lootbox_content GROUP BY game_id;
   ```

## Troubleshooting

If you encounter errors:

1. Check that all games exist in the games table
2. Verify the lootbox_content table structure matches the INSERT statement
3. Ensure the service role key has INSERT permissions on lootbox_content table
4. Check for any unique constraint violations

## Next Steps

After insertion:
1. Verify all 12 records were inserted
2. Test the lootbox content API endpoint
3. Verify HTML content renders correctly in the UI
