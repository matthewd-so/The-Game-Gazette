export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "news" | "reviews" | "previews" | "features" | "opinion";
  status: "draft" | "published";
  hero_image: string | null;
  hero_image_alt: string | null;

  // Game metadata
  game_name: string | null;
  game_slug: string | null;
  game_rawg_id: number | null;
  game_platforms: string[] | null;
  game_genres: string[] | null;
  game_release_date: string | null;
  game_developer: string | null;
  game_publisher: string | null;

  // Review specific
  review_score: number | null;
  review_pros: string[] | null;
  review_cons: string[] | null;
  review_verdict: string | null;

  // AI metadata
  ai_model: string | null;
  ai_prompt_tokens: number | null;
  ai_completion_tokens: number | null;
  source_urls: string[] | null;

  // Stats
  view_count: number;
  comment_count: number;

  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;

  // Joined
  profiles?: Profile;
  replies?: Comment[];
  user_has_liked?: boolean;
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

export interface GenerationLog {
  id: string;
  started_at: string;
  completed_at: string | null;
  status: "running" | "completed" | "failed";
  articles_generated: number;
  total_prompt_tokens: number;
  total_completion_tokens: number;
  errors: string[] | null;
  metadata: Record<string, unknown> | null;
}

export interface ArticleView {
  id: string;
  article_id: string;
  viewer_ip: string | null;
  user_agent: string | null;
  created_at: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ArticleWithProfile extends Article {
  profiles?: Profile;
}
