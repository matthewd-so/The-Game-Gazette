import { createAdminClient } from "@/lib/supabase/admin";
import { getTrendingGames, getGameDetails, searchGames } from "@/lib/rawg";
import { fetchAllFeeds } from "@/lib/rss";
import { fetchTrendingRedditPosts, fetchTopRedditPosts } from "@/lib/reddit";
import { askClaude } from "@/lib/ai/client";
import {
  EDITOR_SYSTEM_PROMPT,
  EDITOR_USER_PROMPT,
  WRITER_SYSTEM_PROMPT,
  WRITER_USER_PROMPT,
} from "@/lib/ai/prompts";
import type { RawgGame } from "@/lib/rawg";
import type { RedditPost } from "@/lib/reddit";

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

function formatRedditPost(post: RedditPost): string {
  return `- [r/${post.subreddit}] "${post.title}" (${post.score} upvotes, ${post.numComments} comments)${post.flair ? ` [${post.flair}]` : ""}${post.selftext ? `\n  Context: ${post.selftext.slice(0, 200)}` : ""}`;
}

/**
 * Try to find a game image from RAWG. Searches by name and returns the
 * background_image URL which is a reliable, high-quality game screenshot.
 */
async function findGameImage(
  gameName: string,
  gameMap: Map<string, RawgGame>
): Promise<{ image: string | null; game: RawgGame | null }> {
  // Check our existing map first
  const key = gameName.toLowerCase();
  for (const [name, game] of gameMap) {
    if (key.includes(name) || name.includes(key)) {
      if (game.background_image) {
        return { image: game.background_image, game };
      }
    }
  }

  // Search RAWG for the game
  try {
    const results = await searchGames(gameName, 3);
    if (results.length > 0 && results[0].background_image) {
      gameMap.set(results[0].name.toLowerCase(), results[0]);
      return { image: results[0].background_image, game: results[0] };
    }
  } catch {
    console.warn(`[Pipeline] RAWG search failed for "${gameName}"`);
  }

  return { image: null, game: null };
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
    console.log("[Pipeline] Step 1: Research - scraping Reddit, RSS, and RAWG...");

    const [redditTrending, redditTop, rssItems, trendingGames] =
      await Promise.allSettled([
        fetchTrendingRedditPosts(),
        fetchTopRedditPosts(),
        fetchAllFeeds(),
        getTrendingGames(20),
      ]);

    const reddit = [
      ...(redditTrending.status === "fulfilled" ? redditTrending.value : []),
      ...(redditTop.status === "fulfilled" ? redditTop.value : []),
    ];
    const rss = rssItems.status === "fulfilled" ? rssItems.value : [];
    const trending = trendingGames.status === "fulfilled" ? trendingGames.value : [];

    console.log(
      `[Pipeline] Research complete: ${reddit.length} Reddit posts, ${rss.length} RSS items, ${trending.length} trending games`
    );

    if (reddit.length === 0 && rss.length === 0) {
      throw new Error("No research data available from Reddit or RSS");
    }

    // Get recent article titles to avoid duplicates
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentArticles } = await supabase
      .from("articles")
      .select("title")
      .gte("created_at", sevenDaysAgo.toISOString());

    const recentTitles = (recentArticles || []).map(
      (a: { title: string }) => a.title
    );

    // ============ STEP 2: EDITORIAL ============
    console.log("[Pipeline] Step 2: Editorial - Claude picking 10 stories...");

    // Deduplicate reddit posts by score
    const uniqueReddit = reddit
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);

    const editorResponse = await askClaude(
      EDITOR_SYSTEM_PROMPT,
      EDITOR_USER_PROMPT(
        uniqueReddit.map(formatRedditPost).join("\n"),
        rss
          .slice(0, 30)
          .map((r) => `[${r.source}] ${r.title}`)
          .join("\n"),
        trending.map(formatGameForPrompt).join("\n"),
        recentTitles
      ),
      { model: "claude-haiku-4-5-20251001", maxTokens: 4096, temperature: 0.8 }
    );

    result.totalPromptTokens += editorResponse.promptTokens;
    result.totalCompletionTokens += editorResponse.completionTokens;

    let editorial;
    try {
      editorial = JSON.parse(editorResponse.content);
    } catch {
      const jsonMatch = editorResponse.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        editorial = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse editorial response as JSON");
      }
    }

    const stories = editorial.stories || [];
    console.log(
      `[Pipeline] Editor selected ${stories.length} stories: ${stories.map((s: { headline_idea: string }) => s.headline_idea).join(", ")}`
    );

    // ============ STEP 3: WRITING ============
    console.log("[Pipeline] Step 3: Writing articles...");

    // Build a game image lookup map from trending games
    const gameMap = new Map<string, RawgGame>();
    for (const game of trending) {
      gameMap.set(game.name.toLowerCase(), game);
    }

    for (const story of stories) {
      try {
        console.log(`[Pipeline] Writing: "${story.headline_idea}" (${story.category})`);

        // Find game image from RAWG
        const { image: gameImageUrl, game: gameData } = await findGameImage(
          story.game_name,
          gameMap
        );

        // If we didn't find in map, try fetching details by ID
        let finalGameData = gameData;
        if (!finalGameData && story.game_rawg_id) {
          try {
            finalGameData = await getGameDetails(story.game_rawg_id);
          } catch {
            // ignore
          }
        }

        const gameDetailsText = finalGameData
          ? `Name: ${finalGameData.name}
Release Date: ${finalGameData.released || "TBA"}
Rating: ${finalGameData.rating}/5
Metacritic: ${finalGameData.metacritic || "N/A"}
Platforms: ${finalGameData.platforms?.map((p) => p.platform.name).join(", ")}
Genres: ${finalGameData.genres?.map((g) => g.name).join(", ")}
Developers: ${finalGameData.developers?.map((d) => d.name).join(", ") || "N/A"}
Publishers: ${finalGameData.publishers?.map((p) => p.name).join(", ") || "N/A"}
Description: ${finalGameData.description_raw?.slice(0, 500) || "N/A"}`
          : `Name: ${story.game_name}\nCategory: ${story.category}\nNote: Limited game data available, write based on the news angle.`;

        const heroImage = gameImageUrl || finalGameData?.background_image || null;

        const writerResponse = await askClaude(
          WRITER_SYSTEM_PROMPT,
          WRITER_USER_PROMPT(
            story.category,
            story.game_name,
            story.angle,
            story.source_context || "",
            gameDetailsText,
            heroImage
          ),
          {
            model: "claude-sonnet-4-20250514",
            maxTokens: 4096,
            temperature: 0.7,
          }
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

        // Ensure the image is embedded in the content if it wasn't already
        let content = article.content || "";
        if (heroImage && !content.includes(heroImage)) {
          // Add the image right after the first paragraph or at the top
          const firstBreak = content.indexOf("\n\n");
          if (firstBreak > 0) {
            content =
              content.slice(0, firstBreak) +
              `\n\n![${story.game_name}](${heroImage})\n\n` +
              content.slice(firstBreak + 2);
          } else {
            content = `![${story.game_name}](${heroImage})\n\n` + content;
          }
        }

        // ============ STEP 4: STORAGE ============
        const slug = slugify(article.title) + "-" + Date.now().toString(36);

        // Find related source URLs from Reddit and RSS
        const gameNameLower = story.game_name.toLowerCase();
        const firstWord = gameNameLower.split(" ")[0];
        const sourceUrls = [
          ...reddit
            .filter((r) => r.title.toLowerCase().includes(firstWord))
            .slice(0, 2)
            .map((r) => r.permalink),
          ...rss
            .filter((r) => r.title.toLowerCase().includes(firstWord))
            .slice(0, 2)
            .map((r) => r.link),
        ].slice(0, 4);

        const { error: insertError } = await supabase.from("articles").insert({
          title: article.title,
          slug,
          excerpt: article.excerpt,
          content,
          category: story.category,
          status: "draft",
          hero_image: heroImage,
          hero_image_alt: finalGameData
            ? `${finalGameData.name} screenshot`
            : `${story.game_name} image`,
          game_name: story.game_name,
          game_slug: finalGameData?.slug || slugify(story.game_name),
          game_rawg_id: finalGameData?.id || story.game_rawg_id || null,
          game_platforms:
            finalGameData?.platforms?.map((p) => p.platform.name) || null,
          game_genres:
            finalGameData?.genres?.map((g) => g.name) || null,
          game_release_date: finalGameData?.released || null,
          game_developer:
            finalGameData?.developers?.[0]?.name || null,
          game_publisher:
            finalGameData?.publishers?.[0]?.name || null,
          review_score: article.review_score || null,
          review_pros: article.review_pros || null,
          review_cons: article.review_cons || null,
          review_verdict: article.review_verdict || null,
          ai_model: writerResponse.model,
          ai_prompt_tokens: writerResponse.promptTokens,
          ai_completion_tokens: writerResponse.completionTokens,
          source_urls: sourceUrls.length > 0 ? sourceUrls : null,
        });

        if (insertError) {
          result.errors.push(
            `Insert error for "${article.title}": ${insertError.message}`
          );
        } else {
          result.articlesGenerated++;
          console.log(`[Pipeline] ✓ Created: "${article.title}"`);
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        result.errors.push(
          `Failed to write article for "${story.game_name}": ${msg}`
        );
        console.error(`[Pipeline] ✗ Error writing article:`, error);
      }
    }

    // Update generation log
    if (logId) {
      await supabase
        .from("generation_logs")
        .update({
          status:
            result.errors.length > 0 && result.articlesGenerated === 0
              ? "failed"
              : "completed",
          completed_at: new Date().toISOString(),
          articles_generated: result.articlesGenerated,
          total_prompt_tokens: result.totalPromptTokens,
          total_completion_tokens: result.totalCompletionTokens,
          errors: result.errors.length > 0 ? result.errors : null,
        })
        .eq("id", logId);
    }

    console.log(
      `[Pipeline] Complete! Generated ${result.articlesGenerated} articles.`
    );
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
