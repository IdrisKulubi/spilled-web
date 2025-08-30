import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import HomeHubTabs from "@/components/app/HomeHubTabs";
import ProfileDropdown from "@/components/app/ProfileDropdown";

export default async function AppHomePage() {
  const { data: session } = await auth.api.getSession({ headers: await headers() });
  const user = (session?.user ?? null) as any | null;
  const displayName = user?.nickname || (user?.email ? String(user.email).split("@")[0] : "bestie");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">What vibe are we serving today? ✨</h1>
          <p className="text-sm text-muted-foreground">Hi {displayName}! Explore, search, or share your story.</p>
        </div>
        <ProfileDropdown />
      </div>
      <HomeHubTabs displayName={displayName} />
    </div>
  );
}

