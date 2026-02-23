"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentThread } from "@/components/comments/comment-thread";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import type { Comment } from "@/types/database";

interface CommentSectionProps {
  articleId: string;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from("comments")
      .select(`
        *,
        profiles (id, display_name, avatar_url)
      `)
      .eq("article_id", articleId)
      .is("parent_id", null)
      .order("created_at", { ascending: false });

    if (data) {
      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.map(async (comment: any) => {
          const { data: replies } = await supabase
            .from("comments")
            .select(`
              *,
              profiles (id, display_name, avatar_url)
            `)
            .eq("parent_id", comment.id)
            .order("created_at", { ascending: true });

          // Check if user has liked this comment and its replies
          let userLikes: string[] = [];
          if (user) {
            const commentIds = [comment.id, ...(replies || []).map((r: Comment) => r.id)];
            const { data: likes } = await supabase
              .from("comment_likes")
              .select("comment_id")
              .eq("user_id", user.id)
              .in("comment_id", commentIds);
            userLikes = (likes || []).map((l: { comment_id: string }) => l.comment_id);
          }

          return {
            ...comment,
            user_has_liked: userLikes.includes(comment.id),
            replies: (replies || []).map((r: Comment) => ({
              ...r,
              user_has_liked: userLikes.includes(r.id),
            })),
          };
        })
      );

      setComments(commentsWithReplies);
    }

    setLoading(false);
  }, [articleId, supabase, user]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentAdded = () => {
    fetchComments();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Comments ({comments.length})
      </h2>

      {user ? (
        <CommentForm
          articleId={articleId}
          onCommentAdded={handleCommentAdded}
        />
      ) : (
        <div className="bg-muted/50 rounded-lg p-6 text-center mb-6">
          <p className="text-muted-foreground mb-3">
            Sign in to join the conversation
          </p>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              articleId={articleId}
              onCommentAdded={handleCommentAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
