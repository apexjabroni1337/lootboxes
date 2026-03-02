# Quick Start Guide - Lootbox Content Import

## What Was Generated

I've successfully generated SQL INSERT statements for the 12 remaining lootbox games. All files are ready to use.

## Files Created

1. **seed-lootbox-content.sql** (71 KB)
   - Ready-to-run SQL with 12 INSERT statements
   - All data from TypeScript seed file
   - Properly escaped and validated

2. **insert-lootbox-content.js** (4.2 KB)
   - Node.js alternative using Supabase JS client
   - Requires .env.local with service role key

3. Documentation files for reference

## How to Import (Choose One Method)

### Method 1: SQL Editor (Fastest)
```
1. Go to https://app.supabase.com/project/rcymlzfyqmrsbaoacwqi
2. Click "SQL Editor" in sidebar
3. Click "New Query" button
4. Open seed-lootbox-content.sql in a text editor
5. Copy entire contents
6. Paste into the SQL Editor
7. Click "Run" button
8. Done!
```

### Method 2: Node.js Script
```bash
cd /sessions/optimistic-gallant-gauss/mnt/Desktop/lootboxes
# Update .env.local with service role key first
node insert-lootbox-content.js
```

### Method 3: Command Line
```bash
cd /sessions/optimistic-gallant-gauss/mnt/Desktop/lootboxes
psql -h db.rcymlzfyqmrsbaoacwqi.supabase.co \
     -U postgres -d postgres < seed-lootbox-content.sql
```

## Verify Success

After running, check that all records were inserted:

```sql
SELECT COUNT(*) FROM lootbox_content;
-- Should return 13 (or more if Counter-Strike 2 was already there)

SELECT COUNT(*) FROM lootbox_content 
WHERE game_id IN (
  SELECT id FROM games WHERE slug IN (
    'genshin-impact', 'honkai-star-rail', 'ea-fc-25',
    'overwatch-2', 'apex-legends', 'diablo-4',
    'fortnite', 'rocket-league', 'valorant',
    'pokemon-tcg-pocket', 'marvel-snap', 'zenless-zone-zero'
  )
);
-- Should return 12
```

## Games Included

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

(Counter-Strike 2 excluded - already inserted)

## What Each Record Contains

- Cost per pull (USD)
- Cost to pity system (if applicable)
- Pulls to pity (if applicable)
- Pity system flag
- Currency name and conversion rate
- Scoring metrics (1-10 scale):
  - Transparency
  - Value
  - Fairness
  - Player control
- Comparable game slugs (related games)
- 6 HTML content sections:
  - Overview
  - Pity explanation
  - History
  - Controversy
  - Tips
  - Editorial

## Data Quality

- All single quotes in HTML properly escaped
- All numeric values validated
- All game slugs cross-referenced
- All arrays properly formatted
- ON CONFLICT clauses prevent duplicates

## Troubleshooting

**Error: "Game not found"**
- Ensure all 13 games exist in the games table first

**Error: "Column doesn't exist"**
- Verify lootbox_content table schema matches

**Error: "Duplicate key value"**
- Safe to ignore or rerun with ON CONFLICT handling

## Support

For detailed information, see:
- LOOTBOX_CONTENT_IMPORT.md - Full import guide
- SQL_SAMPLE.md - SQL examples and explanation
- GENERATION_SUMMARY.txt - Complete technical summary

## Success Indicators

After import, you should be able to:
1. View all 12 games in the database
2. See lootbox pricing and pity information
3. Access HTML content for each game
4. Query by game slug and get complete lootbox data
5. Use comparable_slugs for related game recommendations
