"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { repoListComments, repoAddComment } from "@/lib/actions/domain";
import { toast } from "sonner";
import { CustomToast, showCommentToast } from "@/components/ui/custom-toast";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  authorName: string | null;
  authorNickname: string | null;
  authorImage: string | null;
};

type CommentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  storyContent: string;
  guyName: string | null;
  onCommentAdded?: () => void;
};

export function CommentModal({ 
  isOpen, 
  onClose, 
  storyId, 
  storyContent, 
  guyName,
  onCommentAdded
}: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, storyId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const result = await repoListComments(storyId);
      if (result.success) {
        setComments(result.data);
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await repoAddComment(storyId, newComment.trim());
      if (result.success) {
        setNewComment("");
        // Refresh comments to show the new one
        await loadComments();
        // Notify parent component about the new comment
        onCommentAdded?.();
        // Show success toast
        const toastData = showCommentToast(true);
        toast.custom(() => (
          <CustomToast 
            type={toastData.type}
            message={toastData.message}
            action="added"
          />
        ));
      } else {
        // Show error toast
        const toastData = showCommentToast(false);
        toast.custom(() => (
          <CustomToast 
            type={toastData.type}
            message={toastData.message}
            action="error"
          />
        ));
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      // Show error toast
      const toastData = showCommentToast(false);
      toast.custom(() => (
        <CustomToast 
          type={toastData.type}
          message={toastData.message}
          action="error"
        />
      ));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
          </DialogTitle>
        </DialogHeader>

        {/* Story Summary */}
        <div className="flex-shrink-0 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 text-sm font-semibold">
                {guyName ? guyName.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{guyName || "Anonymous Guy"}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{storyContent}</p>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <ScrollArea className="flex-1 pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm font-medium text-gray-600">No comments yet</p>
              <p className="text-xs text-muted-foreground">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={comment.id}>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={comment.authorImage || undefined} alt={comment.authorName || "Anonymous"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-xs">
                        {(comment.authorName || comment.authorNickname || "A").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {comment.authorNickname || comment.authorName || "Anonymous"}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                  {index < comments.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Add Comment Section */}
        <div className="flex-shrink-0 border-t pt-4 space-y-3">
          <Textarea
            placeholder="Share your thoughts... (Cmd/Ctrl + Enter to send)"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-[80px] resize-none"
            maxLength={500}
          />
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {newComment.length}/500 characters
            </p>
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
