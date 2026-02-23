import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/articles/article-card";
import { CATEGORIES } from "@/lib/constants";
import type { Article } from "@/types/database";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return { title: "Category Not Found" };

  return {
    title: cat.name,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);

  if (!cat) notFound();

  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .order("published_at", { ascending: false })
    .limit(30);

  const allArticles = (articles || []) as Article[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{cat.name}</h1>
        <p className="text-muted-foreground">{cat.description}</p>
      </div>

      {allArticles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No {cat.name.toLowerCase()} articles yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
