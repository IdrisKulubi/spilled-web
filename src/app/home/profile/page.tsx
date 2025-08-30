import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";

export default async function ProfilePage() {
  const  session  = await auth.api.getSession({ headers: await headers() });
  const user = (session?.user ?? null) as any | null;

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div>
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

