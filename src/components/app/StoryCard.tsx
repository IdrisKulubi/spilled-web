"use client";

import { Card, CardContent } from "@/components/ui/card";

export interface StoryCardProps {
  story: {
    id: string;
    text: string;
    createdAt?: string;
    anonymous?: boolean;
    nickname?: string | null;
    tags?: string[];
    imageUrl?: string | null;
  };
}

export default function StoryCard({ story }: StoryCardProps) {
  const author = story.anonymous ? "Anonymous Sister" : story.nickname || "A Sister";
  return (
    <Card>
      <CardContent className="pt-4 space-y-2">
        <div className="text-sm text-muted-foreground">{author}</div>
        <div className="text-sm leading-6 whitespace-pre-wrap">{story.text}</div>
      </CardContent>
    </Card>
  );
}

