"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Flag, Sparkles, HelpCircle, Send, MessageCircle, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { repoAddReaction, repoListComments, repoAddComment, getStoryDetails } from "@/lib/actions/domain";
import { StoryCardSkeleton } from "./StoryCardSkeleton";
import { CommentLoadingSkeleton } from "./CommentSkeleton";

type Story = {
  id: string;
  content: string;
  imageUrl: string | null;
  tagType: "positive" | "negative" | "neutral" | null;
  createdAt: string;
  guyName: string | null;
  guyPhone: string | null;
  guyAge: number | null;
  guyLocation: string | null;
  reactions: {
    red_flag: number;
    good_vibes: number;
    unsure: number;
  };
  commentCount: number;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  authorName: string | null;
  authorNickname: string | null;
  authorImage: string | null;
};

type StoryDetailPageProps = {
  storyId: string;
  onBack: () => void;
};

export function StoryDetailPage({ storyId, onBack }: StoryDetailPageProps) {
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReactions, setLocalReactions] = useState({ red_flag: 0, good_vibes: 0, unsure: 0 });

  useEffect(() => {
    loadStory();
    loadComments();
  }, [storyId]);

  const loadStory = async () => {
    setIsLoading(true);
    try {
      const result = await getStoryDetails(storyId);
      if (result.success && result.data) {
        setStory(result.data);
        setLocalReactions(result.data.reactions);
      }
    } catch (error) {
      console.error("Failed to load story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const result = await repoListComments(storyId);
      if (result.success) {
        setComments(result.data);
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await repoAddComment(storyId, newComment.trim());
      if (result.success) {
        setNewComment("");
        await loadComments();
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = async (reactionType: 'red_flag' | 'good_vibes' | 'unsure') => {
    try {
      const result = await repoAddReaction(storyId, reactionType);
      if (result.success) {
        setLocalReactions(prev => ({
          ...prev,
          [reactionType]: prev[reactionType] + 1,
        }));
      }
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const getTagInfo = (tagType: string | null) => {
    switch (tagType) {
      case "negative":
        return { label: "🚩 Red Flag", color: "bg-red-100 text-red-800 border-red-200" };
      case "positive":
        return { label: "✨ Good Vibes", color: "bg-green-100 text-green-800 border-green-200" };
      case "neutral":
        return { label: "❓ Unsure", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
      default:
        return { label: "❓ Unknown", color: "bg-gray-100 text-gray-800 border-gray-200" };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <StoryCardSkeleton />
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Story not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const tagInfo = getTagInfo(story.tagType);
  const totalReactions = localReactions.red_flag + localReactions.good_vibes + localReactions.unsure;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Story Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 text-xl font-semibold">
                  {story.guyName ? story.guyName.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${tagInfo.color} border font-medium`}>
                    {tagInfo.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">
                    {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {story.guyName || "Anonymous Guy"}
                    {story.guyAge && (
                      <span className="text-base font-normal text-muted-foreground ml-1">
                        ({story.guyAge})
                      </span>
                    )}
                  </h1>
                  {story.guyLocation && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      📍 {story.guyLocation}
                    </p>
                  )}
                </div>
              </div>
              
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-4">
            <p className="text-base leading-relaxed text-gray-800">
              {story.content}
            </p>
            
            {story.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={story.imageUrl}
                  alt="Story image"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            
            {/* Reactions Section */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => handleReaction('red_flag')}
              >
                <Flag className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{localReactions.red_flag}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => handleReaction('good_vibes')}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{localReactions.good_vibes}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                onClick={() => handleReaction('unsure')}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{localReactions.unsure}</span>
              </Button>
              
              {totalReactions > 0 && (
                <span className="text-sm text-muted-foreground">
                  {totalReactions} reaction{totalReactions !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h2 className="text-lg font-semibold">
                Comments ({comments.length})
              </h2>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Comments List */}
            {isLoadingComments ? (
              <CommentLoadingSkeleton />
            ) : comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageCircle className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-600">No comments yet</p>
                <p className="text-xs text-muted-foreground">Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment, index) => (
                  <div key={comment.id}>
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 mt-1">
                        <AvatarImage src={comment.authorImage || undefined} alt={comment.authorName || "Anonymous"} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700">
                          {(comment.authorName || comment.authorNickname || "A").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
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
                    {index < comments.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Section */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Add a comment</h3>
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyPress}
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {newComment.length}/500 characters
                </p>
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
