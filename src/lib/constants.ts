export const SITE_NAME = "The Game Gazette";
export const SITE_DESCRIPTION = "AI-powered video game news, reviews, and features - delivered daily.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const CATEGORIES = [
  { name: "News", slug: "news", description: "Breaking gaming news and announcements" },
  { name: "Reviews", slug: "reviews", description: "In-depth game reviews with scores" },
  { name: "Previews", slug: "previews", description: "First looks at upcoming games" },
  { name: "Features", slug: "features", description: "Deep dives and analysis" },
  { name: "Opinion", slug: "opinion", description: "Hot takes and editorials" },
] as const;

export type Category = (typeof CATEGORIES)[number]["slug"];

export const SCORE_COLORS: Record<string, string> = {
  masterpiece: "bg-emerald-500", // 9-10
  great: "bg-green-500",         // 8-8.9
  good: "bg-lime-500",           // 7-7.9
  okay: "bg-yellow-500",         // 6-6.9
  mediocre: "bg-orange-500",     // 5-5.9
  bad: "bg-red-500",             // 0-4.9
};

export function getScoreLabel(score: number): string {
  if (score >= 9) return "Masterpiece";
  if (score >= 8) return "Great";
  if (score >= 7) return "Good";
  if (score >= 6) return "Okay";
  if (score >= 5) return "Mediocre";
  return "Bad";
}

export function getScoreColor(score: number): string {
  if (score >= 9) return "bg-emerald-500 text-white";
  if (score >= 8) return "bg-green-500 text-white";
  if (score >= 7) return "bg-lime-500 text-black";
  if (score >= 6) return "bg-yellow-500 text-black";
  if (score >= 5) return "bg-orange-500 text-white";
  return "bg-red-500 text-white";
}

export const RSS_FEEDS = [
  { name: "IGN", url: "https://feeds.feedburner.com/ign/all" },
  { name: "GameSpot", url: "https://www.gamespot.com/feeds/mashup/" },
  { name: "Kotaku", url: "https://kotaku.com/rss" },
  { name: "Polygon", url: "https://www.polygon.com/rss/index.xml" },
  { name: "PC Gamer", url: "https://www.pcgamer.com/rss/" },
  { name: "Eurogamer", url: "https://www.eurogamer.net/feed" },
];
