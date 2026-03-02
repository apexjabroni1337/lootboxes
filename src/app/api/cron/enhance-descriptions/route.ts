import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;

/**
 * Enhance lootbox_content overview_html for all games.
 * Adds additional context paragraphs to make descriptions longer and more informative.
 *
 * GET /api/cron/enhance-descriptions?secret=lootboxes-cron-2026
 */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "lootboxes-cron-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch all games with lootbox content
  const { data: games, error: gamesErr } = await supabase
    .from("games")
    .select(
      `id, slug, title, loot_system_type, lootboxes_score, genres, platforms,
       lootbox_content (
         id, overview_html, cost_per_pull, cost_to_pity, has_pity_system,
         pulls_to_pity, currency_name, currency_per_dollar,
         score_transparency, score_compliance, score_value, score_fairness,
         score_p2w_impact, score_player_control, score_psych_design, score_age_gating
       )`
    )
    .not("loot_system_type", "is", null);

  if (gamesErr || !games) {
    return NextResponse.json({ error: gamesErr?.message || "No games" }, { status: 500 });
  }

  const results: { slug: string; status: string; newLen?: number }[] = [];

  for (const game of games) {
    const lc = Array.isArray(game.lootbox_content)
      ? game.lootbox_content[0]
      : game.lootbox_content;
    if (!lc) {
      results.push({ slug: game.slug, status: "skipped_no_content" });
      continue;
    }

    const existingHtml = lc.overview_html || "";
    // Only enhance if the overview is short (under 1200 chars)
    if (existingHtml.length > 1200) {
      results.push({ slug: game.slug, status: "already_long" });
      continue;
    }

    const enhanced = buildEnhancedOverview(game, lc, existingHtml);

    const { error: updateErr } = await supabase
      .from("lootbox_content")
      .update({ overview_html: enhanced })
      .eq("id", lc.id);

    if (updateErr) {
      results.push({ slug: game.slug, status: "error: " + updateErr.message });
    } else {
      results.push({ slug: game.slug, status: "updated", newLen: enhanced.length });
    }
  }

  return NextResponse.json({ updated: results.filter(r => r.status === "updated").length, total: games.length, results });
}

/* ── Build enhanced overview HTML ── */
function buildEnhancedOverview(game: any, lc: any, existingHtml: string): string {
  const paragraphs: string[] = [];
  const title = game.title;
  const type = game.loot_system_type;
  const score = game.lootboxes_score;
  const costPerPull = lc.cost_per_pull;
  const hasPity = lc.has_pity_system;
  const pullsToPity = lc.pulls_to_pity;
  const costToPity = lc.cost_to_pity;
  const currency = lc.currency_name;
  const currPerDollar = lc.currency_per_dollar;

  // Keep all existing paragraphs
  paragraphs.push(existingHtml);

  // Add system type context paragraph
  const typeContextMap: Record<string, string> = {
    gacha: `<p>As a gacha game, ${title} uses a randomized summoning system where players spend premium currency to pull for characters, weapons, or other collectibles from a rotating pool. The appeal of gacha lies in the excitement of the pull, but the randomized nature means players can spend significant amounts before obtaining the specific item they want. Understanding the underlying rates and mechanics is essential for making informed spending decisions.</p>`,

    loot_box: `<p>The loot box model in ${title} follows the traditional format where players purchase or earn containers with randomized contents. Unlike direct-purchase stores, loot boxes introduce an element of chance — you don't know exactly what you'll receive until you open one. This model has been the subject of significant regulatory scrutiny worldwide, and understanding the specific odds and value proposition is crucial before spending.</p>`,

    card_pack: `<p>Card pack systems like the one in ${title} borrow from the long tradition of physical trading card games, offering randomized packs of digital cards with varying rarities. Building a competitive collection often requires opening many packs, and the economics of pack-opening vs. crafting individual cards is a key consideration for players looking to optimize their spending.</p>`,

    cosmetic_shop: `<p>${title} uses a direct-purchase cosmetic shop model, which is generally considered one of the more consumer-friendly monetization approaches in gaming. Players can see exactly what they're buying before making a purchase, eliminating the randomized element found in loot boxes and gacha systems. However, cosmetic shops can still feature aggressive pricing strategies, limited-time offers, and psychological pressure tactics that warrant scrutiny.</p>`,

    battle_pass: `<p>The battle pass system in ${title} offers a structured progression path where players unlock rewards by playing and completing challenges over a defined season. This model gives players clear visibility into what they can earn, making it more predictable than loot boxes or gacha systems. The key question is whether the pass provides sufficient value relative to its cost and the time investment required to complete it.</p>`,
  };

  if (type && typeContextMap[type]) {
    paragraphs.push(typeContextMap[type]);
  }

  // Add cost analysis paragraph if we have pricing data
  if (costPerPull && costPerPull > 0) {
    let costParagraph = `<p>From a cost perspective, each pull in ${title} runs approximately <strong>$${costPerPull.toFixed(2)} USD</strong>`;
    if (currency && currPerDollar) {
      costParagraph += ` (${currPerDollar} ${currency} per dollar)`;
    }
    costParagraph += ". ";

    if (hasPity && pullsToPity) {
      costParagraph += `The game does include a pity system that guarantees a high-rarity drop within ${pullsToPity} pulls`;
      if (costToPity && costToPity > 0) {
        costParagraph += `, which translates to roughly <strong>$${costToPity.toFixed(2)}</strong> in the worst-case scenario`;
      }
      costParagraph += ". While this provides a ceiling on spending, it's worth noting that reaching pity is designed to feel like a significant investment.";
    } else if (!hasPity) {
      costParagraph += "Notably, there is <strong>no pity or mercy system</strong> in place, meaning unlucky players could theoretically spend indefinitely without receiving the item they're targeting. This is one of the more consumer-unfriendly aspects of the monetization design.";
    }
    costParagraph += "</p>";
    paragraphs.push(costParagraph);
  }

  // Add score context paragraph
  if (score !== null && score !== undefined) {
    let scoreDesc = "";
    if (score >= 8) {
      scoreDesc = `one of the more consumer-friendly monetization systems we've analyzed. The combination of transparent odds, fair pricing, and respect for player investment puts it in the top tier of our database`;
    } else if (score >= 6) {
      scoreDesc = `a reasonably fair monetization system with some notable strengths. While not without areas for improvement, the overall experience is above average compared to industry standards`;
    } else if (score >= 4) {
      scoreDesc = `a mixed bag when it comes to monetization fairness. There are aspects that work well for players, but also areas where the system could be significantly more consumer-friendly`;
    } else {
      scoreDesc = `one of the more concerning monetization implementations in our database. Multiple factors contribute to a system that often prioritizes revenue extraction over fair value for players`;
    }

    // Add specific score dimension callouts
    const dims = [
      { key: "score_transparency", label: "transparency", val: lc.score_transparency },
      { key: "score_value", label: "value proposition", val: lc.score_value },
      { key: "score_fairness", label: "fairness", val: lc.score_fairness },
      { key: "score_p2w_impact", label: "pay-to-win impact", val: lc.score_p2w_impact },
      { key: "score_psych_design", label: "psychological design", val: lc.score_psych_design },
    ];

    const highs = dims.filter(d => d.val && d.val >= 7).map(d => d.label);
    const lows = dims.filter(d => d.val && d.val < 4).map(d => d.label);

    let scoreParagraph = `<p>Our analysis gives ${title} a <strong>Lootboxes Score of ${score.toFixed(1)}/10</strong>, reflecting ${scoreDesc}.`;
    if (highs.length > 0) {
      scoreParagraph += ` Standout strengths include ${highs.join(", ")}.`;
    }
    if (lows.length > 0) {
      scoreParagraph += ` Areas of concern include ${lows.join(", ")}.`;
    }
    scoreParagraph += " Read our full breakdown below for detailed scoring across all eight evaluation dimensions.</p>";
    paragraphs.push(scoreParagraph);
  }

  return paragraphs.join("\n");
}
