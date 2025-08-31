"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ensureProfileExists } from "@/lib/actions/domain";

export default function ProfileOnboardingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("Creating your profile...");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await ensureProfileExists();
        if (!mounted) return;
        if ((res as any)?.success) {
          const nextPath = (res as any).nextPath || "/home";
          router.replace(nextPath);
        } else {
          setStatus("Failed to create profile. Please refresh.");
        }
      } catch (e) {
        setStatus("Failed to create profile. Please refresh.");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl text-primary">☕️</div>
        <h1 className="text-2xl font-bold">Almost there! ✨</h1>
        <p className="text-sm text-muted-foreground max-w-prose mx-auto">
          We're setting up your profile so you can start spilling the tea.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 text-center space-y-2">
          <div className="text-sm text-muted-foreground">{status}</div>
          <div className="text-xs text-muted-foreground">If this takes too long, refresh the page.</div>
        </CardContent>
      </Card>
    </div>
  );
}

