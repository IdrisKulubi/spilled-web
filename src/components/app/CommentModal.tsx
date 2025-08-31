"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, MessageCircle, MoreHorizontal, Edit, Trash2, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { repoListComments, repoAddComment, repoDeleteComment } from "@/lib/actions/domain";
import { getCurrentUser } from "@/lib/actions/chat";
import { toast } from "sonner";
import { CustomToast, showCommentToast } from "@/components/ui/custom-toast";
import { CommentLoadingSkeleton } from "./CommentSkeleton";
import { EditCommentModal } from "./EditCommentModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  createdByUserId: string | null;
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingComment, setDeletingComment] = useState<Comment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadComments();
      loadCurrentUser();
    }
  }, [isOpen, storyId]);
  
  const loadCurrentUser = async () => {
    try {
      const userResult = await getCurrentUser();
      if (userResult.success && userResult.data) {
        setCurrentUserId(userResult.data.id);
      }
    } catch (error) {
      console.error('Failed to load current user:', error);
    }
  };

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
  
  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteComment = (comment: Comment) => {
    setDeletingComment(comment);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteComment = async () => {
    if (!deletingComment) return;
    
    setIsDeleting(true);
    try {
      const result = await repoDeleteComment(deletingComment.id);
      if (result.success) {
        toast.success("Comment deleted successfully");
        setIsDeleteDialogOpen(false);
        setDeletingComment(null);
        // Refresh comments to reflect the deletion
        await loadComments();
        // Notify parent about comment count change
        if (onCommentAdded) {
          // This callback is used for count updates, so we can reuse it
          onCommentAdded();
        }
      } else {
        toast.error(result.error || "Failed to delete comment");
      }
    } catch (error: any) {
      console.error('Failed to delete comment:', error);
      toast.error(error.message || "Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleCommentUpdated = async () => {
    await loadComments();
    if (onCommentAdded) {
      onCommentAdded();
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
            <CommentLoadingSkeleton />
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm font-medium text-gray-600">No comments yet</p>
              <p className="text-xs text-muted-foreground">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => {
                const isOwner = currentUserId && comment.createdByUserId === currentUserId;
                return (
                  <div key={comment.id}>
                    <div className="flex items-start gap-3 group">
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
                      
                      {isOwner && (
                        <div className="ml-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditComment(comment);
                                }} 
                                className="cursor-pointer text-xs"
                              >
                                <Edit className="h-3 w-3 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteComment(comment);
                                }} 
                                className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700 text-xs"
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                    {index < comments.length - 1 && <Separator className="mt-4" />}
                  </div>
                );
              })}
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
      
      {/* Edit Comment Modal */}
      {editingComment && (
        <EditCommentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingComment(null);
          }}
          commentId={editingComment.id}
          initialContent={editingComment.content}
          onCommentUpdated={handleCommentUpdated}
        />
      )}
      
      {/* Delete Comment Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Delete Comment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteComment}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
