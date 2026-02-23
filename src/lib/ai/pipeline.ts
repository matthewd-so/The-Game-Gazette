import { createAdminClient } from "@/lib/supabase/admin";
import { getTrendingGames, getNewReleases, getUpcomingGames, getGameDetails } from "@/lib/rawg";
import { fetchAllFeeds } from "@/lib/rss";
import { askClaude } from "@/lib/ai/client";
import {
  EDITOR_SYSTEM_PROMPT,
  EDITOR_USER_PROMPT,
  WRITER_SYSTEM_PROMPT,
  WRITER_USER_PROMPT,
} from "@/lib/ai/prompts";
import type { RawgGame } from "@/lib/rawg";

interface PipelineResult {
  articlesGenerated: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  errors: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 100);
}

function formatGameForPrompt(game: RawgGame): string {
  return `- ${game.name} (${game.released || "TBA"}) | Rating: ${game.rating}/5 | Metacritic: ${game.metacritic || "N/A"} | Platforms: ${game.platforms?.map((p) => p.platform.name).join(", ") || "N/A"} | Genres: ${game.genres?.map((g) => g.name).join(", ") || "N/A"}`;
}

export async function runPipeline(): Promise<PipelineResult> {
  const supabase = createAdminClient();
  const result: PipelineResult = {
    articlesGenerated: 0,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    errors: [],
  };

  // Create generation log
  const { data: log } = await supabase
    .from("generation_logs")
    .insert({ status: "running" })
    .select()
    .single();

  const logId = log?.id;

  try {
    // ============ STEP 1: RESEARCH ============
    console.log("[Pipeline] Step 1: Research - fetching data...");

    const [trendingGames, newReleases, upcomingGames, rssItems] =
      await Promise.allSettled([
        getTrendingGames(10),
        getNewReleases(10),
        getUpcomingGames(10),
        fetchAllFeeds(),
      ]);

    const trending = trendingGames.status === "fulfilled" ? trendingGames.value : [];
    const releases = newReleases.status === "fulfilled" ? newReleases.value : [];
    const upcoming = upcomingGames.status === "fulfilled" ? upcomingGames.value : [];
    const rss = rssItems.status === "fulfilled" ? rssItems.value : [];

    if (trending.length === 0 && releases.length === 0 && rss.length === 0) {
      throw new Error("No research data available from any source");
    }

    // Get recent article titles to avoid duplicates
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentArticles } = await supabase
      .from("articles")
      .select("title")
      .gte("created_at", sevenDaysAgo.toISOString());

    const recentTitles = (recentArticles || []).map((a: { title: string }) => a.title);

    // ============ STEP 2: EDITORIAL ============
    console.log("[Pipeline] Step 2: Editorial - Claude picking stories...");

    const editorResponse = await askClaude(
      EDITOR_SYSTEM_PROMPT,
      EDITOR_USER_PROMPT(
        trending.map(formatGameForPrompt).join("\n"),
        releases.map(formatGameForPrompt).join("\n"),
        upcoming.map(formatGameForPrompt).join("\n"),
        rss.slice(0, 30).map((r) => `[${r.source}] ${r.title}`).join("\n"),
        recentTitles
      ),
      { model: "claude-haiku-4-5-20251001", maxTokens: 2048, temperature: 0.8 }
    );

    result.totalPromptTokens += editorResponse.promptTokens;
    result.totalCompletionTokens += editorResponse.completionTokens;

    let editorial;
    try {
      editorial = JSON.parse(editorResponse.content);
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = editorResponse.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        editorial = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse editorial response as JSON");
      }
    }

    const stories = editorial.stories || [];
    console.log(`[Pipeline] Editor selected ${stories.length} stories`);

    // ============ STEP 3: WRITING ============
    console.log("[Pipeline] Step 3: Writing articles...");

    // Build a lookup map of all games we fetched
    const allGames = [...trending, ...releases, ...upcoming];
    const gameMap = new Map<string, RawgGame>();
    for (const game of allGames) {
      gameMap.set(game.name.toLowerCase(), game);
    }

    for (const story of stories) {
      try {
        // Find the game in our data or fetch details
        let gameData = gameMap.get(story.game_name.toLowerCase());
        if (!gameData && story.game_rawg_id) {
          try {
            gameData = await getGameDetails(story.game_rawg_id);
          } catch {
            console.warn(`Could not fetch details for game ${story.game_rawg_id}`);
          }
        }

        const gameDetailsText = gameData
          ? `Name: ${gameData.name}
Release Date: ${gameData.released || "TBA"}
Rating: ${gameData.rating}/5
Metacritic: ${gameData.metacritic || "N/A"}
Platforms: ${gameData.platforms?.map((p) => p.platform.name).join(", ")}
Genres: ${gameData.genres?.map((g) => g.name).join(", ")}
Developers: ${gameData.developers?.map((d) => d.name).join(", ") || "N/A"}
Publishers: ${gameData.publishers?.map((p) => p.name).join(", ") || "N/A"}
Description: ${gameData.description_raw?.slice(0, 500) || "N/A"}`
          : `Name: ${story.game_name}\nCategory: ${story.category}\nNote: Limited game data available.`;

        const writerResponse = await askClaude(
          WRITER_SYSTEM_PROMPT,
          WRITER_USER_PROMPT(
            story.category,
            story.game_name,
            story.angle,
            gameDetailsText
          ),
          { model: "claude-sonnet-4-20250514", maxTokens: 4096, temperature: 0.7 }
        );

        result.totalPromptTokens += writerResponse.promptTokens;
        result.totalCompletionTokens += writerResponse.completionTokens;

        let article;
        try {
          article = JSON.parse(writerResponse.content);
        } catch {
          const jsonMatch = writerResponse.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            article = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("Failed to parse article JSON");
          }
        }

        // ============ STEP 4: STORAGE ============
        const slug = slugify(article.title) + "-" + Date.now().toString(36);

        const { error: insertError } = await supabase.from("articles").insert({
          title: article.title,
          slug,
          excerpt: article.excerpt,
          content: article.content,
          category: story.category,
          status: "draft",
          hero_image: gameData?.background_image || null,
          hero_image_alt: gameData ? `${gameData.name} screenshot` : null,
          game_name: story.game_name,
          game_slug: gameData?.slug || slugify(story.game_name),
          game_rawg_id: gameData?.id || story.game_rawg_id,
          game_platforms: gameData?.platforms?.map((p) => p.platform.name) || null,
          game_genres: gameData?.genres?.map((g) => g.name) || null,
          game_release_date: gameData?.released || null,
          game_developer: gameData?.developers?.[0]?.name || null,
          game_publisher: gameData?.publishers?.[0]?.name || null,
          review_score: article.review_score || null,
          review_pros: article.review_pros || null,
          review_cons: article.review_cons || null,
          review_verdict: article.review_verdict || null,
          ai_model: writerResponse.model,
          ai_prompt_tokens: writerResponse.promptTokens,
          ai_completion_tokens: writerResponse.completionTokens,
          source_urls: rss
            .filter((r) =>
              r.title.toLowerCase().includes(story.game_name.toLowerCase().split(" ")[0])
            )
            .slice(0, 3)
            .map((r) => r.link),
        });

        if (insertError) {
          result.errors.push(`Insert error for "${article.title}": ${insertError.message}`);
        } else {
          result.articlesGenerated++;
          console.log(`[Pipeline] Created article: ${article.title}`);
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        result.errors.push(`Failed to write article for "${story.game_name}": ${msg}`);
        console.error(`[Pipeline] Error writing article:`, error);
      }
    }

    // Update generation log
    if (logId) {
      await supabase
        .from("generation_logs")
        .update({
          status: result.errors.length > 0 && result.articlesGenerated === 0 ? "failed" : "completed",
          completed_at: new Date().toISOString(),
          articles_generated: result.articlesGenerated,
          total_prompt_tokens: result.totalPromptTokens,
          total_completion_tokens: result.totalCompletionTokens,
          errors: result.errors.length > 0 ? result.errors : null,
        })
        .eq("id", logId);
    }

    console.log(`[Pipeline] Complete! Generated ${result.articlesGenerated} articles.`);
    return result;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    result.errors.push(msg);

    if (logId) {
      await supabase
        .from("generation_logs")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
          errors: [msg],
        })
        .eq("id", logId);
    }

    throw error;
  }
}
