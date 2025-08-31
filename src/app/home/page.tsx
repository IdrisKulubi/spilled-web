import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import HomeHubTabsWrapper from "@/components/app/HomeHubTabsWrapper";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Users, Heart } from "lucide-react";

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
    <div className="w-full max-w-full">
      {/* Streamlined header bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {displayName} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore what the community is sharing, search someone specific, or spill your story to help others.
          </p>
        </div>
       
      </div>

      {/* Quick actions bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Search className="h-5 w-5 text-pink-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Quick Search</p>
              <p className="text-xs text-muted-foreground">Find someone</p>
            </div>
            <Button size="sm" variant="ghost" asChild>
              <Link href="#search">Go</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Trending</p>
              <p className="text-xs text-muted-foreground">Hot topics</p>
            </div>
            <Button size="sm" variant="ghost" asChild>
              <Link href="#explore">View</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Community</p>
              <p className="text-xs text-muted-foreground">9.8k helped</p>
            </div>
            <Button size="sm" variant="ghost" asChild>
              <Link href="#explore">Join</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer border-pink-200 bg-pink-50/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Share Story</p>
              <p className="text-xs text-muted-foreground">Help others</p>
            </div>
            <Button size="sm" variant="default" asChild>
              <Link href="/home/add-post">Start</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main content area - full width */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main content - wider */}
        <div className="xl:col-span-9">
          {/* Search bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input 
                  className="flex-1" 
                  placeholder="Search for someone by name, phone, or social handle..." 
                  aria-label="Search"
                />
                <Button asChild>
                  <Link href="#search">Search</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs content */}
          <div id="explore">
            <HomeHubTabsWrapper displayName={displayName} initialTab="explore" />
          </div>
        </div>

        {/* Sidebar - narrower */}
        <aside className="xl:col-span-3">
          <div className="sticky top-4 space-y-4">
            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-sm font-semibold">Community Impact</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-2xl font-bold">2.4k</p>
                    <p className="text-xs text-muted-foreground">Stories shared</p>
                  </div>
                  <div className="text-3xl">📝</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-2xl font-bold">9.8k</p>
                    <p className="text-xs text-muted-foreground">Girls helped</p>
                  </div>
                  <div className="text-3xl">💕</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-2xl font-bold">12k</p>
                    <p className="text-xs text-muted-foreground">Reactions</p>
                  </div>
                  <div className="text-3xl">✨</div>
                </div>
              </CardContent>
            </Card>

            {/* Trending */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-sm font-semibold">Trending Tags</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link 
                    href="#search" 
                    className="px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition-colors"
                  >
                    🚩 Red Flag
                  </Link>
                  <Link 
                    href="#search" 
                    className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200 transition-colors"
                  >
                    ✨ Good Vibes
                  </Link>
                  <Link 
                    href="#search" 
                    className="px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium hover:bg-yellow-200 transition-colors"
                  >
                    ❓ Unsure
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-sm font-medium mb-1">Got tea to spill?</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Your story could save another girl
                </p>
                <Button className="w-full" asChild>
                  <Link href="/home/add-post">Share Your Story</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
      </div>
    );
  }

