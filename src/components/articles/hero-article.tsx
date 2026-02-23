import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare } from "lucide-react";
import { ScoreBadge } from "@/components/articles/score-badge";
import type { Article } from "@/types/database";

interface HeroArticleProps {
  article: Article;
}

export function HeroArticle({ article }: HeroArticleProps) {
  const publishedDate = article.published_at
    ? format(new Date(article.published_at), "MMMM d, yyyy")
    : format(new Date(article.created_at), "MMMM d, yyyy");

  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="relative aspect-[21/9] md:aspect-[21/8] rounded-xl overflow-hidden">
        {article.hero_image ? (
          <Image
            src={article.hero_image}
            alt={article.hero_image_alt || article.title}
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-8xl">🎮</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {article.review_score !== null && (
          <div className="absolute top-4 right-4">
            <ScoreBadge score={article.review_score} size="lg" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-primary text-primary-foreground capitalize">
              {article.category}
            </Badge>
            {article.game_name && (
              <Badge variant="outline" className="border-white/30 text-white">
                {article.game_name}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-3">
            {article.title}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl line-clamp-2 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-4 text-xs md:text-sm text-white/60">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {publishedDate}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {article.comment_count} comments
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
