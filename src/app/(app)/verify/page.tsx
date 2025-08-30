import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";

export default async function VerifyPage() {
  const  session = await auth.api.getSession({ headers: await headers() });
  const user = (session?.user ?? null) as any | null;

  if (user?.verified) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <div className="text-5xl">✅</div>
            <div className="text-lg font-semibold">Verification Complete!</div>
            <p className="text-sm text-muted-foreground">You're verified. You can post stories, comment, and explore freely.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPending = user?.verificationStatus === "pending" && user?.idImageUrl && String(user.idImageUrl).trim() !== "";

  if (isPending) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <div className="text-5xl">⏳</div>
            <div className="text-lg font-semibold">Verification Pending</div>
            <p className="text-sm text-muted-foreground">We're reviewing your ID. You'll be notified once it's approved.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 text-center space-y-2">
          <div className="text-5xl">🆔</div>
          <div className="text-lg font-semibold">Verify Your Identity</div>
          <p className="text-sm text-muted-foreground max-w-prose mx-auto">
            To keep Spilled safe for women, we need to verify your identity. Upload a photo of your ID in the mobile app or use the upcoming web upload flow.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

