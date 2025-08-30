"use client";

import { Card, CardContent } from "@/components/ui/card";

export function ExploreSection() {
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

