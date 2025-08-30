"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const router = useRouter();
  const session = authClient.useSession();

  // Redirect if already signed in (do this in an effect to avoid setState during render)
  useEffect(() => {
    if (session.data?.user) {
      router.replace("/home");
    }
  }, [session.data?.user, router]);

  if (session.data?.user) {
    // While the redirect is firing, render nothing to avoid flicker
    return null;
  }

  const signInGoogle = async () => {
    try {
      // Use the correct better-auth client API
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/home",
      });
    } catch (e) {
      console.error("Google sign-in failed", e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome to Spilled</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue</p>
        </div>
        <Button onClick={signInGoogle} className="w-full">Continue with Google</Button>
      </div>
    </div>
  );
}
