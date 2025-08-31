import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const  session  = await auth.api.getSession({ headers: await headers() });
  const user = (session?.user ?? null) as any | null;

  if (!user) return null;

  return (
    <div className="space-y-4">
      {/* Back button */}
      <div className="flex items-center gap-4">
        <Link href="/home">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Your Profile</h1>
      </div>
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div>
            <div className="text-sm text-muted-foreground">Email</div>
            <div className="text-sm">{user.email}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Nickname</div>
            <div className="text-sm">{user.nickname || "Not set"}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Phone</div>
            <div className="text-sm">{user.phone || "Not set"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

