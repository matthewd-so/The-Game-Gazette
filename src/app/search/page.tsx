"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ArticleCard } from "@/components/articles/article-card";
import { Search, Loader2 } from "lucide-react";
import type { Article } from "@/types/database";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searched, setSearched] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setTotalCount(0);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery.trim())}&pageSize=20`
      );
      const data = await response.json();

      if (response.ok) {
        setResults(data.data || []);
        setTotalCount(data.count || 0);
      } else {
        setResults([]);
        setTotalCount(0);
      }
    } catch {
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        router.replace(`/search?q=${encodeURIComponent(query.trim())}`, {
          scroll: false,
        });
        performSearch(query);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, performSearch, router]);

  // Search on initial load if query param exists
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search articles, games, reviews..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-lg"
          autoFocus
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Searching...</span>
        </div>
      ) : searched && results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No results found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try different keywords or browse our categories.
          </p>
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {totalCount} result{totalCount !== 1 ? "s" : ""} found
          </p>
          <div className="space-y-4">
            {results.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="horizontal"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Search for articles, games, and reviews
          </p>
        </div>
      )}
    </div>
  );
}
