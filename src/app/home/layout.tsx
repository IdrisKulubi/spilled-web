import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Standardize getSession usage to match other server components
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as any | undefined;

  if (!user?.id) {
    // Not authenticated -> send to landing
    redirect("/");
  }

  // Only enforce authentication at the layout level. Per-page routes can add their own gates.

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}
