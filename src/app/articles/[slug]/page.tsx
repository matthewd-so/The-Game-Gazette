import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Eye, MessageSquare } from "lucide-react";
import { ArticleContent } from "@/components/articles/article-content";
import { GameSidebar } from "@/components/articles/game-sidebar";
import { ReviewSummary } from "@/components/articles/review-summary";
import { CommentSection } from "@/components/comments/comment-section";
import { ViewTracker } from "@/components/view-tracker";
import { createClient } from "@/lib/supabase/server";
import { SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt, hero_image, game_name")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.hero_image ? [article.hero_image] : [],
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) notFound();

  const publishedDate = article.published_at
    ? format(new Date(article.published_at), "MMMM d, yyyy")
    : format(new Date(article.created_at), "MMMM d, yyyy");

  const isReview =
    article.category === "reviews" &&
    article.review_score !== null &&
    article.review_pros &&
    article.review_cons &&
    article.review_verdict;

  return (
    <div className="container mx-auto px-4 py-8">
      <ViewTracker articleId={article.id} />

      {/* Hero */}
      {article.hero_image && (
        <div className="relative aspect-video md:aspect-[21/9] rounded-xl overflow-hidden mb-8">
          <Image
            src={article.hero_image}
            alt={article.hero_image_alt || article.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Article header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="capitalize">{article.category}</Badge>
            {article.game_name && (
              <Badge variant="outline">{article.game_name}</Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">{article.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {publishedDate}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.view_count} views
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {article.comment_count} comments
            </span>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Content + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Review summary at top if review */}
            {isReview && (
              <div className="mb-8">
                <ReviewSummary
                  score={article.review_score!}
                  pros={article.review_pros!}
                  cons={article.review_cons!}
                  verdict={article.review_verdict!}
                />
              </div>
            )}

            <ArticleContent content={article.content} />

            {/* Source attribution */}
            {article.source_urls && article.source_urls.length > 0 && (
              <div className="mt-8 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Sources:{" "}
                  {article.source_urls.map((url: string, i: number) => (
                    <span key={i}>
                      {i > 0 && ", "}
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-foreground"
                      >
                        {new URL(url).hostname}
                      </a>
                    </span>
                  ))}
                </p>
              </div>
            )}

            <Separator className="my-8" />

            {/* Comments */}
            <CommentSection articleId={article.id} />
          </div>

          {/* Sidebar */}
          {article.game_name && (
            <div className="w-full lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <GameSidebar article={article} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
