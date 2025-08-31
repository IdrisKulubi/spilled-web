"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Flag, Sparkles, HelpCircle, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { repoAddReaction, repoRemoveReaction, getUserReaction } from "@/lib/actions/domain";
import { CommentModal } from "./CommentModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CustomToast, showReactionToast, showCommentToast } from "@/components/ui/custom-toast";

type StoryCardProps = {
  story: {
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
  onStoryClick?: (storyId: string) => void;
};

export function StoryCard({ story, onStoryClick }: StoryCardProps) {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [localReactions, setLocalReactions] = useState(story.reactions);
  const [localCommentCount, setLocalCommentCount] = useState(story.commentCount);
  const [userReaction, setUserReaction] = useState<'red_flag' | 'good_vibes' | 'unsure' | null>(null);
  const [isReacting, setIsReacting] = useState(false);
  const [isLoadingUserReaction, setIsLoadingUserReaction] = useState(true);
  
  // Load user's current reaction on mount
  useEffect(() => {
    async function loadUserReaction() {
      try {
        const result = await getUserReaction(story.id);
        if (result.success) {
          setUserReaction(result.data);
        }
      } catch (error) {
        console.error('Failed to load user reaction:', error);
      } finally {
        setIsLoadingUserReaction(false);
      }
    }
    
    loadUserReaction();
  }, [story.id]);

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

  const handleReaction = async (reactionType: 'red_flag' | 'good_vibes' | 'unsure') => {
    if (isReacting || isLoadingUserReaction) return;
    
    setIsReacting(true);
    
    try {
      const isSameReaction = userReaction === reactionType;
      
      if (isSameReaction) {
        // Remove the current reaction
        const result = await repoRemoveReaction(story.id, reactionType);
        
        if (result.success) {
          // Update local state
          setLocalReactions(prev => ({
            ...prev,
            [reactionType]: Math.max(0, prev[reactionType] - 1),
          }));
          setUserReaction(null);
          const toastData = showReactionToast(reactionType, 'removed');
          toast.custom(() => (
            <CustomToast 
              type={toastData.type}
              message={toastData.message}
              reactionType={reactionType}
              action="removed"
            />
          ));
        } else {
          toast.error('Failed to remove reaction. Please try again.');
        }
      } else {
        // Add new reaction or switch to different reaction
        const result = await repoAddReaction(story.id, reactionType);
        
        if (result.success) {
          // Update local state
          setLocalReactions(prev => {
            const newReactions = { ...prev };
            
            // If user had a previous reaction, decrement it
            if (userReaction) {
              newReactions[userReaction] = Math.max(0, newReactions[userReaction] - 1);
            }
            
            // Increment the new reaction
            newReactions[reactionType] = newReactions[reactionType] + 1;
            
            return newReactions;
          });
          
          setUserReaction(reactionType);
          
          const action = userReaction ? 'switched' : 'added';
          const toastData = showReactionToast(reactionType, action);
          toast.custom(() => (
            <CustomToast 
              type={toastData.type}
              message={toastData.message}
              reactionType={reactionType}
              action={action}
            />
          ));
        } else {
          toast.error('Failed to add reaction. Please try again.');
        }
      }
    } catch (error) {
      console.error('Failed to handle reaction:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsReacting(false);
    }
  };

  const handleCardClick = () => {
    if (onStoryClick) {
      onStoryClick(story.id);
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCommentModalOpen(true);
  };

  const handleCommentAdded = () => {
    setLocalCommentCount(prev => prev + 1);
  };

  const tagInfo = getTagInfo(story.tagType);
  const totalReactions = localReactions.red_flag + localReactions.good_vibes + localReactions.unsure;

  return (
    <>
      <Card 
        className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 text-lg font-semibold">
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
                <h3 className="font-semibold text-gray-900 truncate">
                  {story.guyName || "Anonymous Guy"}
                  {story.guyAge && (
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      ({story.guyAge})
                    </span>
                  )}
                </h3>
                {story.guyLocation && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    📍 {story.guyLocation}
                  </p>
                )}
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4">
          <p className="text-sm leading-relaxed text-gray-800">
            {story.content}
          </p>
          
          {story.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img
                src={story.imageUrl}
                alt="Story image"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          {/* Reactions Section */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700",
                  userReaction === 'red_flag' && "bg-red-100 text-red-700 font-semibold"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaction('red_flag');
                }}
                disabled={isReacting || isLoadingUserReaction}
              >
                <Flag className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">{localReactions.red_flag}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-green-600 hover:bg-green-50 hover:text-green-700",
                  userReaction === 'good_vibes' && "bg-green-100 text-green-700 font-semibold"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaction('good_vibes');
                }}
                disabled={isReacting || isLoadingUserReaction}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">{localReactions.good_vibes}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700",
                  userReaction === 'unsure' && "bg-yellow-100 text-yellow-700 font-semibold"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaction('unsure');
                }}
                disabled={isReacting || isLoadingUserReaction}
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">{localReactions.unsure}</span>
              </Button>
              
              {totalReactions > 0 && (
                <span className="text-xs text-muted-foreground ml-2">
                  {totalReactions} reaction{totalReactions !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              onClick={handleCommentClick}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">{localCommentCount}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        storyId={story.id}
        storyContent={story.content}
        guyName={story.guyName}
        onCommentAdded={handleCommentAdded}
      />
    </>
  );
}

