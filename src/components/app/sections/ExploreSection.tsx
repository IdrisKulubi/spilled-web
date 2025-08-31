"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchStories } from "@/lib/actions/domain";
import { StoryCard } from "../StoryCard";
import { StoryDetailPage } from "../StoryDetailPage";
import { StoryCardSkeletonList } from "../StoryCardSkeleton";

type Story = {
  id: string;
  content: string;
  imageUrl: string | null;
  tagType: "positive" | "negative" | "neutral" | null;
  createdAt: string;
  createdByUserId: string | null;
  guyName: string | null;
  guyPhone: string | null;
  guyAge: number | null;
  guyLocation: string | null;
  authorName: string | null;
  authorNickname: string | null;
  authorImage: string | null;
  reactions: {
    red_flag: number;
    good_vibes: number;
    unsure: number;
  };
  commentCount: number;
};

export function ExploreSection() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  useEffect(() => {
    async function loadStories() {
      try {
        const result = await fetchStories(10, 0);
        if (result.success) {
          setStories(result.data as Story[]);
        } else {
          setError(result.error || 'Failed to load stories');
        }
      } catch (err) {
        setError('Failed to load stories');
        console.error('Error loading stories:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStories();
  }, []);

  const handleStoryClick = (storyId: string) => {
    setSelectedStoryId(storyId);
  };

  const handleBackFromStory = () => {
    setSelectedStoryId(null);
  };

  // If a story is selected, show the detail page
  if (selectedStoryId) {
    return (
      <StoryDetailPage 
        storyId={selectedStoryId} 
        onBack={handleBackFromStory} 
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Latest Tea ☕</h2>
          <p className="text-sm text-muted-foreground">
            Real stories from real girls - stay safe out here! 💜
          </p>
        </div>
        <StoryCardSkeletonList count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Latest Tea ☕</h2>
          <p className="text-sm text-muted-foreground">
            Real stories from real girls - stay safe out here! 💜
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center space-y-2">
              <div className="text-5xl">⚠️</div>
              <div className="text-lg font-semibold">Error Loading Stories</div>
              <p className="text-sm text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Latest Tea ☕</h2>
          <p className="text-sm text-muted-foreground">
            Real stories from real girls - stay safe out here! 💜
          </p>
        </div>

        <div className="flex items-center justify-center py-12">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center space-y-2">
              <div className="text-5xl">💬</div>
              <div className="text-lg font-semibold">No Stories Yet</div>
              <p className="text-sm text-muted-foreground">
                Be the first to spill the tea and help build this supportive community 💕
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Latest Tea ☕</h2>
        <p className="text-sm text-muted-foreground">
          Real stories from real girls - stay safe out here! 💜
        </p>
      </div>

      <div className="grid gap-6">
        {stories.map((story) => (
          <StoryCard 
            key={story.id} 
            story={story} 
            onStoryClick={handleStoryClick}
          />
        ))}
      </div>
    </div>
  );
}

