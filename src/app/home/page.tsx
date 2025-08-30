import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import HomeHubTabs from "@/components/app/HomeHubTabs";
import ProfileDropdown from "@/components/app/ProfileDropdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function AppHomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = (session?.user ?? null) as any | null;

  // If not verified, send to verify flow (accept either boolean or status)
  const isVerified = !!(user && (user.verified || user.verificationStatus === "approved"));
  if (user && !isVerified) {
    return redirect("/home/verify");
  }

  const displayName = user?.nickname || (user?.email ? String(user.email).split("@")[0] : "bestie");

  return (
    <div className="space-y-8">
      {/* Top hero under the fixed navbar */}
      <Card className="border-0 bg-gradient-to-r from-pink-50 to-white">
        <CardContent className="px-4 py-6 md:px-8 md:py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-pink-600">Home</div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {displayName} 👋</h1>
              <p className="text-sm text-muted-foreground max-w-prose">
                Explore what the community is sharing, search someone specific, or spill your story to help others.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button asChild>
                  <Link href="/home/add-post">Share a story</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="#explore">Explore feed</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="#search">Quick search</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <ProfileDropdown />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tabs and feed */}
        <section className="lg:col-span-8 space-y-6 min-w-0" id="explore">
          <HomeHubTabs displayName={displayName} initialTab="explore" />
        </section>

        {/* Right: Quick actions / stats */}
        <aside className="lg:col-span-4 space-y-6 min-w-0 lg:sticky lg:top-28 h-max">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="text-sm font-medium">Quick search</div>
              <div className="flex items-center gap-2">
                <Input className="flex-1" placeholder="Name, phone, socials..." aria-label="Quick search" />
                <Button asChild variant="secondary">
                  <Link href="#search">Search</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="text-sm font-medium">Community impact</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md border p-2">
                  <div className="text-lg font-semibold">2.4k</div>
                  <div className="text-xs text-muted-foreground">Stories</div>
                </div>
                <div className="rounded-md border p-2">
                  <div className="text-lg font-semibold">9.8k</div>
                  <div className="text-xs text-muted-foreground">Girls helped</div>
                </div>
                <div className="rounded-md border p-2">
                  <div className="text-lg font-semibold">12k</div>
                  <div className="text-xs text-muted-foreground">Reactions</div>
                </div>
              </div>
              <div className="pt-2">
                <Button asChild className="w-full">
                  <Link href="/home/add-post">Share your story</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="text-sm font-medium">Trending tags</div>
              <div className="flex flex-wrap gap-2">
                {["red_flag", "good_vibes", "unsure"].map((t) => (
                  <Link key={t} href="#search" className="px-3 py-1 rounded-full border text-xs">
                    {t === "red_flag" ? "Red Flag 🚩" : t === "good_vibes" ? "Good Vibes ✨" : "Unsure ❓"}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );

