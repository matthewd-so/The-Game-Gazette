export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, MessageSquare, Zap } from "lucide-react";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { count: totalArticles },
    { count: publishedArticles },
    { count: draftArticles },
    { count: totalComments },
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase.from("comments").select("*", { count: "exact", head: true }),
  ]);

  // Recent generation logs
  const { data: recentLogs } = await supabase
    .from("generation_logs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(5);

  // Top articles by views
  const { data: topArticles } = await supabase
    .from("articles")
    .select("id, title, slug, view_count, comment_count")
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(5);

  const stats = [
    {
      title: "Total Articles",
      value: totalArticles || 0,
      icon: FileText,
      description: `${publishedArticles || 0} published, ${draftArticles || 0} drafts`,
    },
    {
      title: "Total Views",
      value: topArticles?.reduce((sum, a) => sum + (a.view_count || 0), 0) || 0,
      icon: Eye,
      description: "Across all articles",
    },
    {
      title: "Comments",
      value: totalComments || 0,
      icon: MessageSquare,
      description: "From community members",
    },
    {
      title: "Drafts Pending",
      value: draftArticles || 0,
      icon: Zap,
      description: "Awaiting review",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Articles</CardTitle>
          </CardHeader>
          <CardContent>
            {topArticles && topArticles.length > 0 ? (
              <div className="space-y-3">
                {topArticles.map((article, i) => (
                  <div key={article.id} className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground w-6">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {article.view_count} views &middot; {article.comment_count}{" "}
                        comments
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No articles yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Generations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent AI Runs</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs && recentLogs.length > 0 ? (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {log.articles_generated} articles generated
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.started_at).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        log.status === "completed"
                          ? "bg-green-500/10 text-green-500"
                          : log.status === "failed"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No generation runs yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
