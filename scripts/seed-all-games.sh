#!/bin/bash
# ============================================================
# Seed all lootbox games — calls the API endpoint in batches
# Usage: ./scripts/seed-all-games.sh
# ============================================================

BASE_URL="${SITE_URL:-https://lootboxes.com}"
SECRET="lootboxes-cron-2026"
BATCH=0
HAS_MORE=true

echo "🎮 Seeding all lootbox games..."
echo "Base URL: $BASE_URL"
echo ""

while [ "$HAS_MORE" = "true" ]; do
  echo "📦 Processing batch $BATCH..."

  RESPONSE=$(curl -s "$BASE_URL/api/admin/seed-all-lootbox-games?secret=$SECRET&batch=$BATCH")

  # Extract key stats
  CREATED=$(echo "$RESPONSE" | grep -o '"gamesCreated":[0-9]*' | cut -d: -f2)
  UPDATED=$(echo "$RESPONSE" | grep -o '"gamesUpdated":[0-9]*' | cut -d: -f2)
  CONTENT=$(echo "$RESPONSE" | grep -o '"lootboxContentCreated":[0-9]*' | cut -d: -f2)
  PROCESSED=$(echo "$RESPONSE" | grep -o '"processed":"[^"]*"' | cut -d'"' -f4)
  HAS_MORE=$(echo "$RESPONSE" | grep -o '"hasMore":[a-z]*' | cut -d: -f2)

  echo "   Games: $PROCESSED | Created: $CREATED | Updated: $UPDATED | Content: $CONTENT"

  # Check for errors
  ERRORS=$(echo "$RESPONSE" | grep -o '"errors":\[\]')
  if [ -z "$ERRORS" ]; then
    echo "   ⚠️  Some errors occurred — check full response"
  fi

  BATCH=$((BATCH + 1))

  # Small delay between batches
  sleep 1
done

echo ""
echo "✅ All batches complete!"
echo "🔗 Check your lootbox database at: $BASE_URL/lootbox"
