"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Article } from "@/types/database";

export default function ApprovalQueuePage() {
  const [drafts, setDrafts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);

  const fetchDrafts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "draft")
      .order("created_at", { ascending: false });

    setDrafts((data as Article[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handlePublish = async (id: string) => {
    setPublishing(id);
    try {
      const response = await fetch(`/api/articles/${id}/publish`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Article published!");
        fetchDrafts();
      } else {
        toast.error("Failed to publish article");
      }
    } catch {
      toast.error("Error publishing article");
    } finally {
      setPublishing(null);
    }
  };

  const handleReject = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (!error) {
      toast.success("Article rejected and deleted");
      fetchDrafts();
    } else {
      toast.error("Failed to delete article");
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Approval Queue</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Approval Queue</h1>
      <p className="text-muted-foreground mb-6">
        {drafts.length} article{drafts.length !== 1 ? "s" : ""} awaiting review
      </p>

      {drafts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No draft articles to review. Trigger an AI generation to create new
              content!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {drafts.map((article) => (
            <Card key={article.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="capitalize">
                        {article.category}
                      </Badge>
                      {article.game_name && (
                        <Badge variant="outline">{article.game_name}</Badge>
                      )}
                      {article.review_score !== null && (
                        <Badge className="bg-primary">
                          Score: {article.review_score}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {article.excerpt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {format(new Date(article.created_at), "MMM d, yyyy 'at' h:mm a")}
                      {article.ai_model && ` · AI Model: ${article.ai_model}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(`/admin/articles/${article.id}`, "_blank")
                      }
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handlePublish(article.id)}
                      disabled={publishing === article.id}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {publishing === article.id ? "Publishing..." : "Publish"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(article.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
