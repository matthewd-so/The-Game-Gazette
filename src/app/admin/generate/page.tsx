"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function GeneratePage() {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    articlesGenerated?: number;
    totalPromptTokens?: number;
    totalCompletionTokens?: number;
    errors?: string[];
    error?: string;
  } | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/generate", {
        method: "POST",
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success(
          `Generated ${data.articlesGenerated} article(s)! Check the approval queue.`
        );
      } else {
        toast.error(data.error || "Generation failed");
      }
    } catch (error) {
      toast.error("Failed to trigger generation");
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">AI Content Generation</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Manual Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Trigger the AI content pipeline manually. This will research
            trending games and news, then generate 3-5 articles as drafts.
            Articles will appear in the approval queue for review before
            publishing.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            This process typically takes 2-3 minutes and uses approximately
            $2-5 in API credits.
          </p>
          <Button
            onClick={handleGenerate}
            disabled={generating}
            size="lg"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating... (this takes a few minutes)
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate Articles
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Generation Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Articles Generated:</strong>{" "}
                  {result.articlesGenerated}
                </p>
                <p>
                  <strong>Prompt Tokens:</strong>{" "}
                  {result.totalPromptTokens?.toLocaleString()}
                </p>
                <p>
                  <strong>Completion Tokens:</strong>{" "}
                  {result.totalCompletionTokens?.toLocaleString()}
                </p>
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-yellow-500">Warnings:</p>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {result.errors.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-500">{result.error}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
