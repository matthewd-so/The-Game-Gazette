export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // Top articles by views
  const { data: topByViews } = await supabase
    .from("articles")
    .select("id, title, slug, category, view_count, comment_count, published_at")
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(10);

  // Top articles by comments
  const { data: topByComments } = await supabase
    .from("articles")
    .select("id, title, slug, category, view_count, comment_count, published_at")
    .eq("status", "published")
    .order("comment_count", { ascending: false })
    .limit(10);

  // Category breakdown
  const { data: categoryData } = await supabase
    .from("articles")
    .select("category")
    .eq("status", "published");

  const categoryCounts: Record<string, number> = {};
  (categoryData || []).forEach((a: { category: string }) => {
    categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
  });

  // Generation logs
  const { data: logs } = await supabase
    .from("generation_logs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(10);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      {/* Category Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Articles by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div
                key={cat}
                className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2"
              >
                <Badge variant="outline" className="capitalize">
                  {cat}
                </Badge>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
          {Object.keys(categoryCounts).length === 0 && (
            <p className="text-sm text-muted-foreground">No published articles yet.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top by views */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Viewed</CardTitle>
          </CardHeader>
          <CardContent>
            {topByViews && topByViews.length > 0 ? (
              <div className="space-y-3">
                {topByViews.map((article, i) => (
                  <div key={article.id} className="flex items-start gap-3">
                    <span className="text-lg font-bold text-muted-foreground w-6 flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {article.view_count} views &middot;{" "}
                        {article.published_at &&
                          format(
                            new Date(article.published_at),
                            "MMM d, yyyy"
                          )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Top by comments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Discussed</CardTitle>
          </CardHeader>
          <CardContent>
            {topByComments && topByComments.length > 0 ? (
              <div className="space-y-3">
                {topByComments.map((article, i) => (
                  <div key={article.id} className="flex items-start gap-3">
                    <span className="text-lg font-bold text-muted-foreground w-6 flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {article.comment_count} comments &middot;{" "}
                        {article.published_at &&
                          format(
                            new Date(article.published_at),
                            "MMM d, yyyy"
                          )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Generation History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generation History</CardTitle>
        </CardHeader>
        <CardContent>
          {logs && logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Articles</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Tokens</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const duration =
                      log.completed_at && log.started_at
                        ? Math.round(
                            (new Date(log.completed_at).getTime() -
                              new Date(log.started_at).getTime()) /
                              1000
                          )
                        : null;
                    return (
                      <tr key={log.id} className="border-b border-border/50">
                        <td className="py-2 px-2">
                          {format(new Date(log.started_at), "MMM d, h:mm a")}
                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              log.status === "completed"
                                ? "bg-green-500/10 text-green-500"
                                : log.status === "failed"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2 px-2">{log.articles_generated}</td>
                        <td className="py-2 px-2">
                          {(
                            log.total_prompt_tokens +
                            log.total_completion_tokens
                          ).toLocaleString()}
                        </td>
                        <td className="py-2 px-2">
                          {duration ? `${duration}s` : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No generation history yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
