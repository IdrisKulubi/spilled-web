"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Flag, Sparkles, HelpCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fetchStories } from "@/lib/actions/domain";

interface RecentStoryItem {
  id: string;
  content: string;
  imageUrl: string | null;
  tagType: "positive" | "negative" | "neutral" | null;
  createdAt: string;
  guyName: string | null;
  guyLocation: string | null;
  reactions: {
    red_flag: number;
    good_vibes: number;
    unsure: number;
  };
  commentCount: number;
}

type RecentActivityFeedProps = {
  onStoryClick?: (storyId: string) => void;
  maxItems?: number;
};

export function RecentActivityFeed({ onStoryClick, maxItems = 4 }: RecentActivityFeedProps) {
  const [recentStories, setRecentStories] = useState<RecentStoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecentActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchStories(maxItems, 0);
        if (response.success) {
          setRecentStories(response.data as RecentStoryItem[]);
        } else {
          setError("Failed to load recent activity");
        }
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadRecentActivity();
  }, [maxItems]);

  const getTagInfo = (tagType: string | null) => {
    switch (tagType) {
      case "negative":
        return { label: "🚩", color: "bg-red-100 text-red-800 border-red-200" };
      case "positive":
        return { label: "✨", color: "bg-green-100 text-green-800 border-green-200" };
      case "neutral":
        return { label: "❓", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
      default:
        return { label: "💭", color: "bg-gray-100 text-gray-800 border-gray-200" };
    }
  };

  const truncateContent = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  const handleStoryClick = (storyId: string) => {
    if (onStoryClick) {
      onStoryClick(storyId);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <h3 className="text-sm font-semibold">Fresh Tea Just Dropped ☕</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-2 bg-gray-200 rounded animate-pulse w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <h3 className="text-sm font-semibold">Fresh Tea Just Dropped ☕</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-2xl mb-2">😞</div>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Fresh Tea Just Dropped ☕</h3>
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <p className="text-xs text-muted-foreground">Latest community updates</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentStories.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-2xl mb-2">🌱</div>
            <p className="text-xs text-muted-foreground">
              No stories yet! Be the first to share some tea ☕
            </p>
          </div>
        ) : (
          recentStories.map((story) => {
            const tagInfo = getTagInfo(story.tagType);
            const totalReactions = story.reactions.red_flag + story.reactions.good_vibes + story.reactions.unsure;
            
            return (
              <div
                key={story.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleStoryClick(story.id)}
              >
                <Avatar className="h-8 w-8 border shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 text-xs font-semibold">
                    {story.guyName ? story.guyName.charAt(0).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className={`${tagInfo.color} border text-xs font-medium px-1.5 py-0.5`}>
                      {tagInfo.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-xs leading-relaxed text-gray-800">
                    {truncateContent(story.content)}
                  </p>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {totalReactions > 0 && (
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{totalReactions}</span>
                      </div>
                    )}
                    {story.commentCount > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{story.commentCount}</span>
                      </div>
                    )}
                    {story.guyLocation && (
                      <div className="flex items-center gap-1">
                        <span>📍 {story.guyLocation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {recentStories.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <button 
              onClick={() => {
                // Scroll to explore section
                document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs text-primary hover:text-primary/80 font-medium w-full text-center py-1"
            >
              See all stories →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
