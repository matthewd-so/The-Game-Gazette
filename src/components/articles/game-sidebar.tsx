import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Cpu, Building2, Gamepad2 } from "lucide-react";
import { format } from "date-fns";
import type { Article } from "@/types/database";

interface GameSidebarProps {
  article: Article;
}

export function GameSidebar({ article }: GameSidebarProps) {
  if (!article.game_name) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Gamepad2 className="h-4 w-4 text-primary" />
          Game Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <h3 className="font-bold text-base">{article.game_name}</h3>

        {article.game_developer && (
          <div className="flex items-start gap-2 text-sm">
            <Cpu className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-muted-foreground">Developer</span>
              <p className="font-medium">{article.game_developer}</p>
            </div>
          </div>
        )}

        {article.game_publisher && (
          <div className="flex items-start gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-muted-foreground">Publisher</span>
              <p className="font-medium">{article.game_publisher}</p>
            </div>
          </div>
        )}

        {article.game_release_date && (
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-muted-foreground">Release Date</span>
              <p className="font-medium">
                {format(new Date(article.game_release_date), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        )}

        {article.game_platforms && article.game_platforms.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Platforms</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {article.game_platforms.map((p) => (
                <Badge key={p} variant="secondary" className="text-xs">
                  {p}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {article.game_genres && article.game_genres.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Genres</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {article.game_genres.map((g) => (
                <Badge key={g} variant="outline" className="text-xs">
                  {g}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
