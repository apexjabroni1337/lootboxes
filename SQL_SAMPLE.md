# Sample SQL from Generated File

## First INSERT Statement (Genshin Impact)

```sql
INSERT INTO lootbox_content (
  game_id,
  cost_per_pull,
  cost_to_pity,
  pulls_to_pity,
  has_pity_system,
  currency_name,
  currency_per_dollar,
  score_transparency,
  score_value,
  score_fairness,
  score_player_control,
  comparable_slugs,
  overview_html,
  pity_explanation_html,
  history_html,
  controversy_html,
  tips_html,
  editorial_html
)
SELECT
  g.id,
  2.5,
  225,
  90,
  true,
  'Primogems',
  64,
  7,
  2,
  3,
  3,
  ARRAY['honkai-star-rail', 'zenless-zone-zero', 'marvel-snap'],
  '<p>Genshin Impact uses a gacha system called "Wishes"...</p>',
  '<p>Genshin Impact features both <strong>soft pity</strong>...</p>',
  '<p><strong>September 2020:</strong> Genshin Impact launches...</p>',
  '<p>Genshin Impact has faced sustained criticism...</p>',
  '<p><strong>Save for characters you truly want.</strong>...</p>',
  '<p>Genshin Impact occupies a unique position...</p>'
FROM games g
WHERE g.slug = 'genshin-impact'
ON CONFLICT (game_id) DO NOTHING;
```

## Key SQL Features Used

1. **Game ID Lookup**: `SELECT g.id FROM games g WHERE g.slug = '...'`
   - Dynamically retrieves the game ID from the games table
   - Allows the SQL to work even if game IDs change

2. **Array Column**: `ARRAY['slug1', 'slug2', 'slug3']`
   - Used for comparable_slugs
   - PostgreSQL array type for related games

3. **Escape Sequences**: Single quotes in HTML escaped as `''`
   - Example: `"Wish''s"` (apostrophe becomes double quotes)
   - Proper SQL string escaping

4. **Conflict Resolution**: `ON CONFLICT (game_id) DO NOTHING`
   - Prevents duplicate inserts
   - Safe to run multiple times
   - Follows upsert pattern

5. **NULL Handling**:
   - Uses explicit NULL for optional fields
   - Example: Some games have no pity system (NULL for pity fields)

## Data Statistics

- **Total Records**: 12 games (Counter-Strike 2 excluded as already inserted)
- **Total File Size**: 710 lines of SQL
- **Average Sizes**:
  - overview_html: ~300-500 characters each
  - pity_explanation_html: ~200-400 characters each
  - history_html: ~300-500 characters each
  - controversy_html: ~300-500 characters each
  - tips_html: ~300-500 characters each
  - editorial_html: ~500-1000 characters each

## Games Included

1. genshin-impact - Cost: $2.50/pull, Pity: 90 pulls ($225)
2. honkai-star-rail - Cost: $2.50/pull, Pity: 90 pulls ($225)
3. ea-fc-25 - Cost: $1.00/pack, No pity system
4. overwatch-2 - Cost: $2.00/pull, Pity: 25 pulls ($50)
5. apex-legends - Cost: $1.80/pull, Pity: 60 pulls ($108)
6. diablo-4 - Cost: $1.00/roll, No pity system
7. fortnite - Cost: $2.00/roll, No pity system
8. rocket-league - Cost: $1.50-$2.50/crate, No pity system
9. valorant - Cost: $0.49-$4.99/bundle, Mixed system
10. pokemon-tcg-pocket - Cost: $0.99-$6.49/pack, No hard pity
11. marvel-snap - Cost: $0.99-$19.99/token, No pity system
12. zenless-zone-zero - Cost: $1.10/pull, Pity: 60 pulls ($66)

## Validation Checklist

Before running the SQL file, ensure:

- [ ] All 13 games exist in the games table
- [ ] lootbox_content table has all required columns
- [ ] Database user has INSERT permission
- [ ] No duplicate game_ids will be created
- [ ] Foreign key constraints allow the operation
- [ ] Backup of lootbox_content table (if needed)

## Running the SQL

1. **In Supabase Dashboard**:
   - SQL Editor → New Query
   - Copy-paste entire file contents
   - Click "Run"
   - Check the "Results" tab

2. **Via Command Line**:
   ```bash
   psql -h db.rcymlzfyqmrsbaoacwqi.supabase.co \
        -U postgres \
        -d postgres \
        -f seed-lootbox-content.sql
   ```

3. **Using Supabase JS Client** (see insert-lootbox-content.js):
   ```bash
   node insert-lootbox-content.js
   ```

## Verification

After running the SQL:

```sql
-- Verify all 12 records were inserted
SELECT COUNT(*) as total_records FROM lootbox_content;

-- Verify specific games
SELECT g.name, l.cost_per_pull, l.has_pity_system 
FROM lootbox_content l
JOIN games g ON l.game_id = g.id
WHERE g.slug IN ('genshin-impact', 'honkai-star-rail', 'ea-fc-25')
ORDER BY g.name;

-- Check for any NULL game_ids (would indicate lookup failure)
SELECT COUNT(*) as invalid_records FROM lootbox_content WHERE game_id IS NULL;
```
