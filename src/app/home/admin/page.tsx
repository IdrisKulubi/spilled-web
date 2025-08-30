import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { adminListPending, adminFetchStats } from "@/lib/actions/admin";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = (session?.user ?? null) as any | null;

  const adminList = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "").toLowerCase();
  const emails = adminList.split(",").map((e) => e.trim()).filter(Boolean);
  const isAdmin = user?.email && emails.includes(String(user.email).toLowerCase());
  if (!isAdmin) {
    redirect("/home");
  }

  const [pendingRes, statsRes] = await Promise.all([adminListPending(100, 0), adminFetchStats()]);
  const initialPending = (pendingRes as any).data || [];
  const initialStats = (statsRes as any).data || null;

  return (
    <AdminDashboardClient initialPending={initialPending} initialStats={initialStats} />
  );
}

