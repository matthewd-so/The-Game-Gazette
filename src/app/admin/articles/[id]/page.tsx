"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/constants";
import { ArticleContent } from "@/components/articles/article-content";
import type { Article } from "@/types/database";
import Link from "next/link";

export default function ArticleEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();
      setArticle(data as Article);
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  const handleSave = async () => {
    if (!article) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          hero_image: article.hero_image,
          review_score: article.review_score,
          review_verdict: article.review_verdict,
        }),
      });

      if (response.ok) {
        toast.success("Article saved!");
      } else {
        toast.error("Failed to save article");
      }
    } catch {
      toast.error("Error saving article");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const response = await fetch(`/api/articles/${id}/publish`, {
      method: "POST",
    });

    if (response.ok) {
      toast.success("Article published!");
      router.push("/admin/queue");
    } else {
      toast.error("Failed to publish");
    }
  };

  if (loading || !article) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/articles">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Article</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreview(!preview)}
          >
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-1" />
            {saving ? "Saving..." : "Save"}
          </Button>
          {article.status === "draft" && (
            <Button size="sm" onClick={handlePublish}>
              Publish
            </Button>
          )}
        </div>
      </div>

      {preview ? (
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <p className="text-muted-foreground mb-6">{article.excerpt}</p>
            <ArticleContent content={article.content} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={article.title}
              onChange={(e) =>
                setArticle({ ...article, title: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={article.excerpt}
              onChange={(e) =>
                setArticle({ ...article, excerpt: e.target.value })
              }
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={article.category}
                onValueChange={(v) =>
                  setArticle({ ...article, category: v as Article["category"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hero_image">Hero Image URL</Label>
              <Input
                id="hero_image"
                value={article.hero_image || ""}
                onChange={(e) =>
                  setArticle({ ...article, hero_image: e.target.value })
                }
              />
            </div>
          </div>
          {article.category === "reviews" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="score">Review Score (0-10)</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={article.review_score || ""}
                  onChange={(e) =>
                    setArticle({
                      ...article,
                      review_score: parseFloat(e.target.value) || null,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="verdict">Verdict</Label>
                <Input
                  id="verdict"
                  value={article.review_verdict || ""}
                  onChange={(e) =>
                    setArticle({ ...article, review_verdict: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="content">Content (Markdown)</Label>
            <Textarea
              id="content"
              value={article.content}
              onChange={(e) =>
                setArticle({ ...article, content: e.target.value })
              }
              rows={20}
              className="font-mono text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
