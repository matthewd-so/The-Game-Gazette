import { ScoreBadge } from "@/components/articles/score-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface ReviewSummaryProps {
  score: number;
  pros: string[];
  cons: string[];
  verdict: string;
}

export function ReviewSummary({ score, pros, cons, verdict }: ReviewSummaryProps) {
  return (
    <Card className="border-primary/30 glow-primary-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Review Verdict</CardTitle>
          <ScoreBadge score={score} size="lg" showLabel />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground italic">&ldquo;{verdict}&rdquo;</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pros */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-green-500 mb-2">
              <ThumbsUp className="h-4 w-4" />
              Pros
            </h4>
            <ul className="space-y-1">
              {pros.map((pro, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-red-500 mb-2">
              <ThumbsDown className="h-4 w-4" />
              Cons
            </h4>
            <ul className="space-y-1">
              {cons.map((con, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">-</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
