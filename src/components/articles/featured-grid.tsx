import { ArticleCard } from "@/components/articles/article-card";
import type { Article } from "@/types/database";

interface FeaturedGridProps {
  articles: Article[];
}

export function FeaturedGrid({ articles }: FeaturedGridProps) {
  if (articles.length === 0) return null;

  const [first, ...rest] = articles;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {first && (
        <div className="lg:row-span-2">
          <ArticleCard article={first} />
        </div>
      )}
      {rest.slice(0, 3).map((article) => (
        <ArticleCard key={article.id} article={article} variant="horizontal" />
      ))}
    </div>
  );
}
