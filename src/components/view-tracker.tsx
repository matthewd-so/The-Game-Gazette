"use client";

import { useEffect } from "react";

export function ViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    // Fire and forget view tracking
    fetch(`/api/articles/${articleId}/view`, { method: "POST" }).catch(() => {
      // silently ignore view tracking errors
    });
  }, [articleId]);

  return null;
}
