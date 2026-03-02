const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      env[key] = valueParts.join('=');
    }
  });
  return env;
}

async function main() {
  const envFile = '/sessions/optimistic-gallant-gauss/mnt/Desktop/lootboxes/.env.local';
  const envVars = parseEnvFile(envFile);

  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials in .env.local');
    console.error('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'set' : 'NOT SET');
    console.error('  SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'set' : 'NOT SET');
    process.exit(1);
  }

  console.log('Connecting to Supabase...');
  console.log('URL:', supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Read the seed file to get the games data
  const seedFile = fs.readFileSync('/tmp/seed_file.ts', 'utf-8');
  const contentMatch = seedFile.match(/const CONTENT: LootboxSeed\[\] = \[([\s\S]*?)\n\];/);
  
  if (!contentMatch) {
    console.error('Could not parse seed file');
    process.exit(1);
  }

  const contentStr = '[' + contentMatch[1] + '\n]';
  let jsStr = contentStr;
  jsStr = jsStr.replace(/`([^`]*)`/g, (match, content) => {
    const escaped = content
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n');
    return `"${escaped}"`;
  });

  const CONTENT = eval('(' + jsStr + ')');
  const gamesToInsert = CONTENT.filter(game => game.slug !== 'counter-strike-2');

  console.log(`\nFound ${gamesToInsert.length} games to insert:\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const game of gamesToInsert) {
    try {
      // First, get the game_id from the games table
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('id')
        .eq('slug', game.slug)
        .single();

      if (gameError || !gameData) {
        console.error(`✗ ${game.slug}: Game not found in games table`);
        errorCount++;
        continue;
      }

      const game_id = gameData.id;

      // Now insert into lootbox_content
      const { error: insertError } = await supabase
        .from('lootbox_content')
        .upsert({
          game_id,
          cost_per_pull: game.cost_per_pull,
          cost_to_pity: game.cost_to_pity,
          pulls_to_pity: game.pulls_to_pity,
          has_pity_system: game.has_pity_system,
          currency_name: game.currency_name,
          currency_per_dollar: game.currency_per_dollar,
          score_transparency: game.score_transparency,
          score_value: game.score_value,
          score_fairness: game.score_fairness,
          score_player_control: game.score_player_control,
          comparable_slugs: game.comparable_slugs,
          overview_html: game.overview_html,
          pity_explanation_html: game.pity_explanation_html,
          history_html: game.history_html,
          controversy_html: game.controversy_html,
          tips_html: game.tips_html,
          editorial_html: game.editorial_html,
        });

      if (insertError) {
        console.error(`✗ ${game.slug}: ${insertError.message}`);
        errorCount++;
      } else {
        console.log(`✓ ${game.slug}`);
        successCount++;
      }
    } catch (error) {
      console.error(`✗ ${game.slug}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Results: ${successCount} inserted, ${errorCount} failed`);
  console.log(`${'='.repeat(50)}`);

  if (errorCount === 0) {
    console.log('\nAll games inserted successfully!');
    process.exit(0);
  } else {
    console.log('\nSome insertions failed. See details above.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
