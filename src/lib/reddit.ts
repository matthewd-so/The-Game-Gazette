export interface RedditPost {
  title: string;
  subreddit: string;
  url: string;
  permalink: string;
  score: number;
  numComments: number;
  author: string;
  selftext: string;
  thumbnail: string | null;
  created: number;
  flair: string | null;
}

const GAMING_SUBREDDITS = [
  "gaming",
  "Games",
  "pcgaming",
  "PS5",
  "XboxSeriesX",
  "NintendoSwitch",
  "gamernews",
  "truegaming",
  "IndieGaming",
  "patientgamers",
];

async function fetchSubreddit(
  subreddit: string,
  sort: "hot" | "top" | "rising" = "hot",
  limit = 15
): Promise<RedditPost[]> {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}&t=day`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "TheGameGazette/1.0 (AI News Magazine)",
      },
      next: { revalidate: 1800 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    const posts = data?.data?.children || [];

    return posts
      .filter((post: any) => !post.data.stickied && !post.data.over_18)
      .map((post: any) => ({
        title: post.data.title,
        subreddit: post.data.subreddit,
        url: post.data.url,
        permalink: `https://reddit.com${post.data.permalink}`,
        score: post.data.score,
        numComments: post.data.num_comments,
        author: post.data.author,
        selftext: (post.data.selftext || "").slice(0, 500),
        thumbnail:
          post.data.thumbnail && post.data.thumbnail.startsWith("http")
            ? post.data.thumbnail
            : null,
        created: post.data.created_utc,
        flair: post.data.link_flair_text || null,
      }));
  } catch (error) {
    console.warn(`Failed to fetch r/${subreddit}:`, error);
    return [];
  }
}

export async function fetchTrendingRedditPosts(): Promise<RedditPost[]> {
  const allPosts: RedditPost[] = [];

  const results = await Promise.allSettled(
    GAMING_SUBREDDITS.map((sub) => fetchSubreddit(sub, "hot", 15))
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      allPosts.push(...result.value);
    }
  }

  // Sort by score (upvotes), highest first
  allPosts.sort((a, b) => b.score - a.score);

  // Deduplicate by title similarity
  const seen = new Set<string>();
  const unique = allPosts.filter((post) => {
    const key = post.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.slice(0, 50);
}

export async function fetchTopRedditPosts(): Promise<RedditPost[]> {
  const allPosts: RedditPost[] = [];

  // Fetch "top of the day" from key subreddits
  const topSubs = ["gaming", "Games", "pcgaming", "gamernews"];
  const results = await Promise.allSettled(
    topSubs.map((sub) => fetchSubreddit(sub, "top", 10))
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      allPosts.push(...result.value);
    }
  }

  allPosts.sort((a, b) => b.score - a.score);
  return allPosts.slice(0, 30);
}
