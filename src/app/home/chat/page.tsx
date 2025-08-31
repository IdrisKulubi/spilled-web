import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { ChatPageClient } from "@/components/app/ChatPageClient";
import { Button } from "@/components/ui/button";

export default async function ChatPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = (session?.user ?? null) as any | null;

  // If not verified, send to verify flow
  const isVerified = !!(user && (user.verified || user.verificationStatus === "approved"));
  if (!user) {
    return redirect("/signin");
  }
  if (!isVerified) {
    return redirect("/home/verify");
  }

  const displayName = user?.nickname || (user?.email ? String(user.email).split("@")[0] : "bestie");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/home" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold">Messages 💬</h1>
          <p className="text-sm text-muted-foreground">
            Connect with the community privately and securely
          </p>
        </div>
        
        <ChatPageClient />
      </div>
    </div>
  );
}
