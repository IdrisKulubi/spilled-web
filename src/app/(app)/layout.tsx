import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as any | undefined;

  if (!user?.id) {
    redirect("/");
  }

  // Route users based on profile/verification state (mirrors mobile logic)
  const isDatabaseConfirmed = !!user.createdAt;
  if (!isDatabaseConfirmed) {
    redirect("/app/profile/onboarding");
  }

  if (!user.verified) {
    redirect("/app/verify");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}

