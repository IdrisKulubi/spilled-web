"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ShareStorySection() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Share Your Story 📝</h2>
        <p className="text-sm text-muted-foreground">
          Spill the tea to help other girls stay safe ☕✨
        </p>
      </div>

      <Card className="border-primary bg-accent/30">
        <CardContent className="pt-6 text-center space-y-3">
          <div className="text-3xl">✨</div>
          <div className="text-lg font-semibold">Got Tea to Spill?</div>
          <p className="text-sm text-muted-foreground max-w-prose mx-auto">
            Your story could save another girl from a bad situation. Share what you know - it's anonymous and encrypted 💕
          </p>
          <Button asChild>
            <Link href="/app/add-post">Share Your Story</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-2">
        <Card>
          <CardContent className="pt-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Red Flags 🚩</div>
              <div className="text-sm text-muted-foreground">Share warning signs you noticed</div>
            </div>
            <Button asChild variant="ghost"><Link href="/app/add-post">Start</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Good Vibes ✨</div>
              <div className="text-sm text-muted-foreground">Share positive experiences too!</div>
            </div>
            <Button asChild variant="ghost"><Link href="/app/add-post">Start</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Mixed Feelings 🤔</div>
              <div className="text-sm text-muted-foreground">Not sure? Share anyway - it helps!</div>
            </div>
            <Button asChild variant="ghost"><Link href="/app/add-post">Start</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

