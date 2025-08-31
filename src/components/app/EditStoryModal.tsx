"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { AlertCircle, Edit3, Image, X } from "lucide-react";
import { repoUpdateStory, getStoryDetails } from "@/lib/actions/domain";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EditStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  onStoryUpdated?: () => void;
}

type TagType = "red_flag" | "good_vibes" | "unsure";

export function EditStoryModal({ isOpen, onClose, storyId, onStoryUpdated }: EditStoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [nickname, setNickname] = useState("");
  const [originalStory, setOriginalStory] = useState<any>(null);

  useEffect(() => {
    if (isOpen && storyId) {
      loadStory();
    }
  }, [isOpen, storyId]);

  const loadStory = async () => {
    setIsLoading(true);
    try {
      const result = await getStoryDetails(storyId);
      if (result.success && result.data) {
        const story = result.data as any;
        setOriginalStory(story);
        setStoryText(story.content || "");
        
        // Convert tagType to tags array and map from database format
        let tags: TagType[] = [];
        if (story.tagType) {
          // Map database format (positive/negative/neutral) to app format (good_vibes/red_flag/unsure)
          const tagMapping: Record<string, TagType> = {
            "positive": "good_vibes",
            "negative": "red_flag", 
            "neutral": "unsure"
          };
          const mappedTag = tagMapping[story.tagType];
          if (mappedTag) {
            tags = [mappedTag];
          }
        }
        setSelectedTags(tags);
        
        setImageUrl(story.imageUrl || "");
        setIsAnonymous(true); // Default since not stored in current schema
        setNickname(""); // Default since not stored in current schema
      } else {
        toast.error("Story not found");
        onClose();
      }
    } catch (error) {
      console.error("Failed to load story:", error);
      toast.error("Failed to load story details");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tag: TagType) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      // Only allow one tag to be selected
      setSelectedTags([tag]);
    }
  };

  const handleSave = async () => {
    if (!storyText.trim()) {
      toast.error("Story content cannot be empty");
      return;
    }

    if (selectedTags.length === 0) {
      toast.error("Please select at least one tag");
      return;
    }

    setIsSaving(true);
    try {
      const result = await repoUpdateStory(storyId, {
        storyText: storyText.trim(),
        tags: selectedTags,
        imageUrl: imageUrl || null,
        anonymous: isAnonymous,
        nickname: isAnonymous ? null : nickname || null,
      });

      if (result.success) {
        toast.success("Story updated successfully!");
        if (onStoryUpdated) {
          onStoryUpdated();
        }
        handleClose();
      } else {
        toast.error("Failed to update story");
      }
    } catch (error: any) {
      console.error("Failed to update story:", error);
      toast.error(error.message || "Failed to update story");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setStoryText("");
    setSelectedTags([]);
    setImageUrl("");
    setIsAnonymous(true);
    setNickname("");
    setOriginalStory(null);
    onClose();
  };

  const tagOptions = [
    { value: "red_flag" as TagType, label: "🚩 Red Flag", color: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200" },
    { value: "good_vibes" as TagType, label: "✅ Green Flag", color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" },
    { value: "unsure" as TagType, label: "❓ Unsure", color: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-pink-600" />
            Edit Story
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 p-4">
            <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
            <div className="h-8 bg-gray-100 animate-pulse rounded" />
            <div className="h-8 bg-gray-100 animate-pulse rounded" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Story Content */}
            <div className="space-y-2">
              <Label htmlFor="story-content">Story Content</Label>
              <Textarea
                id="story-content"
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="Share your story..."
                className="min-h-[150px] resize-none"
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {storyText.length}/2000 characters
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tag this story</Label>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map(tag => (
                  <button
                    key={tag.value}
                    onClick={() => handleTagToggle(tag.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full border text-sm font-medium transition-all",
                      selectedTags.includes(tag.value) 
                        ? tag.color 
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    )}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image-url" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image URL (optional)
              </Label>
              <Input
                id="image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {imageUrl && (
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Story preview image"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                      setImageUrl("");
                      toast.error("Invalid image URL");
                    }}
                  />
                  <button
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="anonymous-toggle" className="text-sm font-medium">
                  Post Anonymously
                </Label>
                <p className="text-xs text-muted-foreground">
                  Hide your identity from this story
                </p>
              </div>
              <Switch
                id="anonymous-toggle"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>

            {/* Nickname (if not anonymous) */}
            {!isAnonymous && (
              <div className="space-y-2">
                <Label htmlFor="nickname">Display Name (optional)</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter a nickname"
                  maxLength={50}
                />
              </div>
            )}

            {/* Warning Message */}
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-xs text-yellow-800">
                <p className="font-medium">Note:</p>
                <p>Changes to your story will be visible to everyone who can see it.</p>
              </div>
            </div>
          </div>
        )}

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
            disabled={isSaving || isLoading || !storyText.trim() || selectedTags.length === 0}
            className="bg-pink-500 hover:bg-pink-600 text-white"
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
