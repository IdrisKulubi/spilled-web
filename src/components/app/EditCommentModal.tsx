"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Edit3 } from "lucide-react";
import { repoUpdateComment } from "@/lib/actions/domain";
import { toast } from "sonner";

interface EditCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  commentId: string;
  initialContent: string;
  onCommentUpdated?: () => void;
}

export function EditCommentModal({ 
  isOpen, 
  onClose, 
  commentId, 
  initialContent, 
  onCommentUpdated 
}: EditCommentModalProps) {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
    }
  }, [isOpen, initialContent]);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Comment content cannot be empty");
      return;
    }

    if (content.trim() === initialContent.trim()) {
      // No changes made
      handleClose();
      return;
    }

    setIsSaving(true);
    try {
      const result = await repoUpdateComment(commentId, content.trim());

      if (result.success) {
        toast.success("Comment updated successfully!");
        if (onCommentUpdated) {
          onCommentUpdated();
        }
        handleClose();
      } else {
        toast.error(result.error || "Failed to update comment");
      }
    } catch (error: any) {
      console.error("Failed to update comment:", error);
      toast.error(error.message || "Failed to update comment");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setContent("");
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-blue-600" />
            Edit Comment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment-content">Comment</Label>
            <Textarea
              id="comment-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Share your thoughts..."
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length}/500 characters
            </p>
          </div>

          {/* Warning Message */}
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-xs text-yellow-800">
              <p className="font-medium">Note:</p>
              <p>Changes to your comment will be visible to everyone who can see it.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !content.trim() || content.trim() === initialContent.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
