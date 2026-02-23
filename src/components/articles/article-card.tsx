import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Eye, Clock } from "lucide-react";
import { ScoreBadge } from "@/components/articles/score-badge";
import type { Article } from "@/types/database";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "horizontal";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const publishedDate = article.published_at
    ? format(new Date(article.published_at), "MMM d, yyyy")
    : format(new Date(article.created_at), "MMM d, yyyy");

  if (variant === "horizontal") {
    return (
      <Link href={`/articles/${article.slug}`}>
        <Card className="group overflow-hidden hover:border-primary/50 transition-all duration-300">
          <div className="flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-48 md:w-64 h-48 sm:h-auto flex-shrink-0">
              {article.hero_image ? (
                <Image
                  src={article.hero_image}
                  alt={article.hero_image_alt || article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-4xl">🎮</span>
                </div>
              )}
              {article.review_score !== null && (
                <div className="absolute top-2 right-2">
                  <ScoreBadge score={article.review_score} size="sm" />
                </div>
              )}
            </div>
            <CardContent className="flex-1 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs capitalize">
                  {article.category}
                </Badge>
                {article.game_name && (
                  <span className="text-xs text-muted-foreground">
                    {article.game_name}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {publishedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {article.view_count}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {article.comment_count}
                </span>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/articles/${article.slug}`}>
        <div className="group flex gap-3 py-3">
          <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
            {article.hero_image ? (
              <Image
                src={article.hero_image}
                alt={article.hero_image_alt || article.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-xl">🎮</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="text-[10px] capitalize mb-1">
              {article.category}
            </Badge>
            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h4>
            <span className="text-xs text-muted-foreground">{publishedDate}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/articles/${article.slug}`}>
      <Card className="group overflow-hidden hover:border-primary/50 transition-all duration-300 h-full">
        <div className="relative aspect-video overflow-hidden">
          {article.hero_image ? (
            <Image
              src={article.hero_image}
              alt={article.hero_image_alt || article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-5xl">🎮</span>
            </div>
          )}
          {article.review_score !== null && (
            <div className="absolute top-3 right-3">
              <ScoreBadge score={article.review_score} size="sm" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="text-xs capitalize bg-black/50 text-white border-0">
              {article.category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {publishedDate}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {article.comment_count}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
