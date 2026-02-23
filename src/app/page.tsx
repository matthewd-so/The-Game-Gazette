import { createClient } from "@/lib/supabase/server";
import { HeroArticle } from "@/components/articles/hero-article";
import { FeaturedGrid } from "@/components/articles/featured-grid";
import { ArticleCard } from "@/components/articles/article-card";
import { Separator } from "@/components/ui/separator";
import type { Article } from "@/types/database";

export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidate every 5 minutes

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch published articles
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20);

  const allArticles = (articles || []) as Article[];

  if (allArticles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to The Game Gazette</h1>
        <p className="text-lg text-muted-foreground mb-8">
          AI-powered video game journalism is coming soon. Check back after the first
          content generation run!
        </p>
        <div className="text-6xl mb-4">🎮</div>
        <p className="text-sm text-muted-foreground">
          Our AI editorial team publishes fresh content every morning at 8 AM EST.
        </p>
      </div>
    );
  }

  const heroArticle = allArticles[0];
  const featuredArticles = allArticles.slice(1, 5);
  const latestArticles = allArticles.slice(5);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      {heroArticle && (
        <section>
          <HeroArticle article={heroArticle} />
        </section>
      )}

      {/* Featured Grid */}
      {featuredArticles.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Featured</h2>
          <FeaturedGrid articles={featuredArticles} />
        </section>
      )}

      <Separator />

      {/* Latest Articles */}
      {latestArticles.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
