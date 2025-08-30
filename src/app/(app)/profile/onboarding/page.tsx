import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";

export default async function ProfileOnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = (session?.user ?? null) as any | null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl text-primary">☕️</div>
        <h1 className="text-2xl font-bold">Almost there ✨</h1>
        <p className="text-sm text-muted-foreground max-w-prose mx-auto">
          We're setting up your profile so you can start spilling the tea.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 text-center space-y-2">
          <div className="text-sm text-muted-foreground">Creating your profile...</div>
          <div className="text-xs text-muted-foreground">If this takes too long, refresh the page.</div>
        </CardContent>
      </Card>
    </div>
  );
}

