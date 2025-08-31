"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { repoSearchGuys, fetchStories } from "@/lib/actions/domain";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Flag, Sparkles, HelpCircle, Search, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GuyItem {
  id: string;
  name: string | null;
  phone: string | null;
  socials: string | null;
  location: string | null;
  age: number | null;
}

interface StoryItem {
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
}

type SearchSectionProps = {
  onStoryClick?: (storyId: string) => void;
};

export function SearchSection({ onStoryClick }: SearchSectionProps = {}) {
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [storyResults, setStoryResults] = useState<StoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setStoryResults([]);
      setHasSearched(false);
      return;
    }

    setError(null);
    setLoading(true);
    setHasSearched(true);
    
    try {
      // First, get all stories
      const storiesRes = await fetchStories(50, 0); // Get more stories to search through
      if (storiesRes.success) {
        // Filter stories that match the search term
        const stories = storiesRes.data as StoryItem[];
        const filteredStories = stories.filter((story) => {
          const normalizedSearchTerm = searchTerm.toLowerCase();
          return (
            story.guyName?.toLowerCase().includes(normalizedSearchTerm) ||
            story.guyPhone?.includes(normalizedSearchTerm) ||
            story.guyLocation?.toLowerCase().includes(normalizedSearchTerm) ||
            story.content.toLowerCase().includes(normalizedSearchTerm)
          );
        });
        setStoryResults(filteredStories);
      } else {
        setError("Failed to search stories");
      }
    } catch (e: any) {
      setError(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(term);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [term, performSearch]);

  const onClear = () => {
    setTerm("");
    setStoryResults([]);
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

  const handleStoryClick = (storyId: string) => {
    if (onStoryClick) {
      onStoryClick(storyId);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Search for Someone 🔍</h2>
        <p className="text-sm text-muted-foreground">Spill or find the tea ☕</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <label className="text-sm font-medium">Who are we investigating? 👀</label>
          <div className="relative">
            <Input
              placeholder="Name, nickname, phone, social handle... (search as you type)"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="pr-20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {loading && (
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              )}
              {term.length > 0 && !loading && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={onClear}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              {!loading && (
                <Search className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {term.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {loading ? "Searching..." : hasSearched ? `Found ${storyResults.length} result${storyResults.length !== 1 ? 's' : ''}` : "Type to search"}
            </p>
          )}
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && storyResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold">Found the Tea! ☕ ({storyResults.length} stories)</h3>
          {storyResults.map((story) => {
            const tagInfo = getTagInfo(story.tagType);
            const totalReactions = story.reactions.red_flag + story.reactions.good_vibes + story.reactions.unsure;
            
            return (
              <Card 
                key={story.id} 
                className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                onClick={() => handleStoryClick(story.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 text-sm font-semibold">
                        {story.guyName ? story.guyName.charAt(0).toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${tagInfo.color} border text-xs font-medium`}>
                          {tagInfo.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">
                          {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {story.guyName || "Anonymous Guy"}
                          {story.guyAge && (
                            <span className="text-xs font-normal text-muted-foreground ml-1">
                              ({story.guyAge})
                            </span>
                          )}
                        </h4>
                        {story.guyLocation && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            📍 {story.guyLocation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-3">
                  <p className="text-sm leading-relaxed text-gray-800 line-clamp-3">
                    {story.content}
                  </p>
                  
                  {story.imageUrl && (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={story.imageUrl}
                        alt="Story image"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Quick stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-gray-100">
                    {totalReactions > 0 && (
                      <div className="flex items-center gap-1">
                        <span>{totalReactions} reaction{totalReactions !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {story.commentCount > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{story.commentCount} comment{story.commentCount !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      Click to view story
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {!loading && storyResults.length === 0 && term.trim() && hasSearched && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No Tea Found</h3>
          <p className="text-sm text-muted-foreground">
            No stories found for "{term}". Try searching for a different name, location, or keyword.
          </p>
        </div>
      )}

      <Card className="border-primary">
        <CardContent className="pt-6 text-center space-y-2">
          <div className="text-2xl">🛡️</div>
          <p className="text-sm">
            <span className="font-semibold">Privacy Notice:</span> We don't store your searches bestie! All info is encrypted and only verified users can search 💕
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

