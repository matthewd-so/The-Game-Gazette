import Parser from "rss-parser";
import { RSS_FEEDS } from "@/lib/constants";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "The Game Gazette/1.0",
  },
});

export interface RssItem {
  source: string;
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
}

export async function fetchAllFeeds(): Promise<RssItem[]> {
  const allItems: RssItem[] = [];

  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        return (parsed.items || []).slice(0, 10).map((item) => ({
          source: feed.name,
          title: item.title || "Untitled",
          link: item.link || "",
          pubDate: item.pubDate || new Date().toISOString(),
          contentSnippet: item.contentSnippet?.slice(0, 300),
        }));
      } catch (error) {
        console.warn(`Failed to fetch RSS from ${feed.name}:`, error);
        return [];
      }
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  // Sort by date, most recent first
  allItems.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  return allItems.slice(0, 50); // Top 50 recent items
}
