const RAWG_BASE_URL = "https://api.rawg.io/api";
const RAWG_API_KEY = process.env.RAWG_API_KEY;

interface RawgGame {
  id: number;
  name: string;
  slug: string;
  background_image: string | null;
  released: string | null;
  metacritic: number | null;
  rating: number;
  platforms: Array<{ platform: { id: number; name: string; slug: string } }>;
  genres: Array<{ id: number; name: string; slug: string }>;
  developers?: Array<{ id: number; name: string }>;
  publishers?: Array<{ id: number; name: string }>;
  description_raw?: string;
  short_screenshots?: Array<{ id: number; image: string }>;
}

interface RawgResponse {
  count: number;
  results: RawgGame[];
}

async function rawgFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${RAWG_BASE_URL}${endpoint}`);
  url.searchParams.set("key", RAWG_API_KEY || "");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const response = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`RAWG API error: ${response.status}`);
  return response.json();
}

export async function getTrendingGames(count = 10): Promise<RawgGame[]> {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const data = await rawgFetch<RawgResponse>("/games", {
    dates: `${thirtyDaysAgo.toISOString().split("T")[0]},${today.toISOString().split("T")[0]}`,
    ordering: "-added",
    page_size: count.toString(),
  });
  return data.results;
}

export async function getNewReleases(count = 10): Promise<RawgGame[]> {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const data = await rawgFetch<RawgResponse>("/games", {
    dates: `${sevenDaysAgo.toISOString().split("T")[0]},${today.toISOString().split("T")[0]}`,
    ordering: "-released",
    page_size: count.toString(),
  });
  return data.results;
}

export async function getUpcomingGames(count = 10): Promise<RawgGame[]> {
  const today = new Date();
  const threeMonths = new Date(today);
  threeMonths.setMonth(threeMonths.getMonth() + 3);

  const data = await rawgFetch<RawgResponse>("/games", {
    dates: `${today.toISOString().split("T")[0]},${threeMonths.toISOString().split("T")[0]}`,
    ordering: "-added",
    page_size: count.toString(),
  });
  return data.results;
}

export async function getTopRated(count = 10): Promise<RawgGame[]> {
  const data = await rawgFetch<RawgResponse>("/games", {
    ordering: "-metacritic",
    metacritic: "80,100",
    page_size: count.toString(),
  });
  return data.results;
}

export async function getGameDetails(id: number): Promise<RawgGame> {
  return rawgFetch<RawgGame>(`/games/${id}`);
}

export async function searchGames(query: string, count = 5): Promise<RawgGame[]> {
  const data = await rawgFetch<RawgResponse>("/games", {
    search: query,
    page_size: count.toString(),
  });
  return data.results;
}

export type { RawgGame };
