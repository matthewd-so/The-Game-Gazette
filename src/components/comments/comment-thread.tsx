"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Reply } from "lucide-react";
import { CommentForm } from "@/components/comments/comment-form";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types/database";

interface CommentThreadProps {
  comment: Comment;
  articleId: string;
  onCommentAdded: () => void;
}

export function CommentThread({
  comment,
  articleId,
  onCommentAdded,
}: CommentThreadProps) {
  return (
    <div>
      <CommentItem
        comment={comment}
        articleId={articleId}
        onCommentAdded={onCommentAdded}
      />
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-10 mt-2 space-y-2 border-l-2 border-border pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleId={articleId}
              onCommentAdded={onCommentAdded}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  articleId: string;
  onCommentAdded: () => void;
  isReply?: boolean;
}

function CommentItem({
  comment,
  articleId,
  onCommentAdded,
  isReply = false,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [liked, setLiked] = useState(comment.user_has_liked || false);
  const [likeCount, setLikeCount] = useState(comment.like_count);
  const { user } = useAuth();
  const supabase = createClient();

  const handleLike = async () => {
    if (!user) return;

    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      const response = await fetch(`/api/comments/${comment.id}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        // Revert on error
        setLiked(wasLiked);
        setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      }
    } catch {
      setLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  };

  const profile = comment.profiles;
  const displayName = profile?.display_name || "Anonymous";
  const avatarUrl = profile?.avatar_url || undefined;

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback className="text-xs">
          {displayName[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{displayName}</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
          {comment.content}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 px-2 text-xs",
              liked && "text-red-500 hover:text-red-600"
            )}
            onClick={handleLike}
            disabled={!user}
          >
            <Heart
              className={cn("h-3.5 w-3.5 mr-1", liked && "fill-current")}
            />
            {likeCount > 0 && likeCount}
          </Button>
          {!isReply && user && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <Reply className="h-3.5 w-3.5 mr-1" />
              Reply
            </Button>
          )}
        </div>
        {showReplyForm && (
          <div className="mt-3">
            <CommentForm
              articleId={articleId}
              parentId={comment.id}
              onCommentAdded={() => {
                setShowReplyForm(false);
                onCommentAdded();
              }}
              onCancel={() => setShowReplyForm(false)}
              placeholder="Write a reply..."
              compact
            />
          </div>
        )}
      </div>
    </div>
  );
}
