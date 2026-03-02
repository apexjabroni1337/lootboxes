================================================================================
LOOTBOX CONTENT IMPORT - README
================================================================================

Project: lootboxes.com
Generated: 2026-03-02
Purpose: SQL INSERT statements for 12 remaining lootbox game content records

================================================================================
GETTING STARTED
================================================================================

START HERE: Read QUICK_START.md for fastest setup (2 minutes)

Then choose your import method:
1. Supabase SQL Editor (no setup required) - RECOMMENDED
2. Node.js script (requires service role key)
3. Command line psql (requires database access)

================================================================================
FILE GUIDE
================================================================================

PRIMARY FILE:
  seed-lootbox-content.sql (71 KB)
    - Main output file
    - 12 INSERT statements ready to execute
    - All data properly escaped and validated
    - Safe to run multiple times (ON CONFLICT handling)

EXECUTABLE:
  insert-lootbox-content.js (4.2 KB)
    - Node.js alternative to SQL file
    - Uses @supabase/supabase-js library
    - Run: node insert-lootbox-content.js
    - Requires: service role key in .env.local

DOCUMENTATION:
  QUICK_START.md (2 KB)
    - Fast overview and import steps
    - Best for getting started quickly

  LOOTBOX_CONTENT_IMPORT.md (3 KB)
    - Comprehensive import guide
    - Multiple execution methods
    - Data integrity checks
    - Troubleshooting section

  SQL_SAMPLE.md (4 KB)
    - Sample SQL with explanations
    - Data statistics
    - Verification queries
    - Key SQL features used

  GENERATION_SUMMARY.txt (8 KB)
    - Technical details of generation process
    - Complete data structure reference
    - All games listed with details
    - Execution methods explained

  README_LOOTBOX_IMPORT.txt (this file)
    - Guide to all files and process

================================================================================
GAMES INCLUDED (12 TOTAL)
================================================================================

1. Genshin Impact          ($2.50/pull, 90-pull pity = $225)
2. Honkai: Star Rail       ($2.50/pull, 90-pull pity = $225)
3. EA FC 25                ($1.00/pack, NO pity)
4. Overwatch 2             ($2.00/pull, 25-pull pity = $50)
5. Apex Legends            ($1.80/pull, 60-pull pity = $108)
6. Diablo 4                ($1.00/roll, NO pity)
7. Fortnite                ($2.00/roll, NO pity)
8. Rocket League           ($1.50-$2.50, NO pity)
9. Valorant                ($0.49-$4.99, mixed)
10. Pokemon TCG Pocket     ($0.99-$6.49, soft pity only)
11. Marvel Snap            ($0.99-$19.99, NO pity)
12. Zenless Zone Zero      ($1.10/pull, 60-pull pity = $66)

Excluded: Counter-Strike 2 (already inserted)

================================================================================
QUICK IMPORT STEPS
================================================================================

FASTEST METHOD (2-3 minutes):

1. Open seed-lootbox-content.sql in any text editor
2. Copy all contents (Ctrl+A, Ctrl+C)
3. Go to https://app.supabase.com/project/rcymlzfyqmrsbaoacwqi
4. Click "SQL Editor" in left sidebar
5. Click "New Query" button
6. Paste contents (Ctrl+V)
7. Click "Run" button
8. Check results tab for confirmation

That's it! All 12 games are now imported.

================================================================================
WHAT EACH RECORD CONTAINS
================================================================================

Pricing Information:
  - cost_per_pull (in USD)
  - cost_to_pity (total cost to reach pity, if applicable)
  - pulls_to_pity (number of pulls to reach hard pity)
  - has_pity_system (boolean flag)
  - currency_name (in-game currency name)
  - currency_per_dollar (exchange rate)

Scoring Metrics (1-10 scale):
  - score_transparency (how transparent is the system?)
  - score_value (is it good value for money?)
  - score_fairness (is it fair to players?)
  - score_player_control (can players control spending?)

Content & Metadata:
  - comparable_slugs (array of related game slugs)
  - overview_html (description of the system)
  - pity_explanation_html (how pity works)
  - history_html (timeline of changes)
  - controversy_html (controversies and criticism)
  - tips_html (advice for players)
  - editorial_html (our analysis and rating)

================================================================================
DATA QUALITY ASSURANCE
================================================================================

All data has been:
  ✓ Extracted from official TypeScript seed file
  ✓ Properly escaped for SQL (single quotes as '')
  ✓ Validated for correct data types
  ✓ Cross-referenced with game slugs
  ✓ Tested for proper array formatting
  ✓ Reviewed for completeness

================================================================================
VERIFICATION AFTER IMPORT
================================================================================

Verify successful import:

1. Row count check:
   SELECT COUNT(*) as records FROM lootbox_content;
   Expected: 13+ (includes Counter-Strike 2 if already inserted)

2. Verify specific games:
   SELECT g.name FROM games g
   WHERE g.slug IN ('genshin-impact', 'ea-fc-25', 'fortnite')
   AND g.id IN (SELECT game_id FROM lootbox_content);
   Expected: 3 rows

3. Check HTML content:
   SELECT LENGTH(overview_html) as html_length
   FROM lootbox_content l
   JOIN games g ON l.game_id = g.id
   WHERE g.slug = 'genshin-impact';
   Expected: ~300-500 characters

4. Verify arrays:
   SELECT comparable_slugs FROM lootbox_content l
   JOIN games g ON l.game_id = g.id
   WHERE g.slug = 'genshin-impact';
   Expected: ['honkai-star-rail', 'zenless-zone-zero', 'marvel-snap']

================================================================================
TROUBLESHOOTING
================================================================================

PROBLEM: "Game not found in games table"
SOLUTION: Verify all 13 games exist in games table first
  SELECT COUNT(*) FROM games WHERE slug IN ('genshin-impact', ...);

PROBLEM: "Column xxx does not exist"
SOLUTION: Check lootbox_content table schema matches expectations
  \d lootbox_content (in psql)

PROBLEM: "Unique constraint violation"
SOLUTION: Safe to ignore - ON CONFLICT clause prevents actual duplicates
  Or delete existing records: DELETE FROM lootbox_content;

PROBLEM: Script won't run with "node insert-lootbox-content.js"
SOLUTION: 
  1. Update .env.local with actual SUPABASE_SERVICE_ROLE_KEY
  2. Run from project root directory
  3. Ensure node_modules/@supabase/supabase-js exists

================================================================================
NEXT STEPS
================================================================================

After successful import:

1. Test the API endpoint that retrieves lootbox content
2. Verify HTML renders correctly in the UI
3. Check scoring displays properly on game pages
4. Test filtering/sorting by pricing and pity
5. Verify comparable_slugs provides accurate recommendations
6. Check that all 13 games show lootbox content

================================================================================
SUPPORT & DOCUMENTATION
================================================================================

For detailed information on:
  - Import methods: See LOOTBOX_CONTENT_IMPORT.md
  - SQL examples: See SQL_SAMPLE.md
  - Technical details: See GENERATION_SUMMARY.txt
  - Quick start: See QUICK_START.md

================================================================================
FILES LOCATION
================================================================================

All generated files are in:
  /sessions/optimistic-gallant-gauss/mnt/Desktop/lootboxes/

Main file:
  seed-lootbox-content.sql

Supporting files:
  insert-lootbox-content.js
  QUICK_START.md
  LOOTBOX_CONTENT_IMPORT.md
  SQL_SAMPLE.md
  GENERATION_SUMMARY.txt
  README_LOOTBOX_IMPORT.txt (this file)

================================================================================
QUESTIONS OR ISSUES?
================================================================================

1. Check the relevant documentation file above
2. Verify all 13 games exist in games table
3. Ensure lootbox_content table structure is correct
4. Check Supabase service role key is valid
5. Review generated SQL for any obvious issues

All SQL is generated from the official seed file and has been validated.

================================================================================
