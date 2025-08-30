"use client";

import {  useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminListPending, adminApproveUser, adminRejectUser, adminFetchStats, adminDeleteStory, adminDeleteComment, adminUpdateStoryText } from "@/lib/actions/admin";

interface PendingUser {
  id: string;
  email: string | null;
  nickname: string | null;
  phone: string | null;
  idImageUrl: string | null;
  idType: string | null;
  createdAt: string | null;
}

export default function AdminDashboardClient({ initialPending, initialStats }: { initialPending: PendingUser[]; initialStats: any }) {
  const [isPending, startTransition] = useTransition();
  const [pending, setPending] = useState<PendingUser[]>(initialPending || []);
  const [stats, setStats] = useState<any>(initialStats || null);

  const refresh = () => {
    startTransition(async () => {
      const [p, s] = await Promise.all([adminListPending(100, 0), adminFetchStats()]);
      setPending((p as any).data || []);
      setStats((s as any).data || null);
    });
  };

  const approve = (userId: string) => {
    startTransition(async () => {
      await adminApproveUser(userId);
      await refresh();
    });
  };

  const reject = (userId: string) => {
    const reason = window.prompt("Rejection reason?", "ID verification failed");
    startTransition(async () => {
      await adminRejectUser(userId, reason || undefined);
      await refresh();
    });
  };

  const [storyId, setStoryId] = useState("");
  const [commentId, setCommentId] = useState("");
  const [storyText, setStoryText] = useState("");

  const deleteStory = () => {
    if (!storyId.trim()) return;
    startTransition(async () => {
      await adminDeleteStory(storyId.trim());
      setStoryId("");
    });
  };

  const updateStoryText = () => {
    if (!storyId.trim() || !storyText.trim()) return;
    startTransition(async () => {
      await adminUpdateStoryText(storyId.trim(), storyText.trim());
      setStoryText("");
    });
  };

  const deleteComment = () => {
    if (!commentId.trim()) return;
    startTransition(async () => {
      await adminDeleteComment(commentId.trim());
      setCommentId("");
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={refresh} disabled={isPending}>{isPending ? "Refreshing..." : "Refresh"}</Button>
      </div>

      {stats && (
        <Card>
          <CardContent className="pt-6 grid sm:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Pending</div>
              <div className="text-lg font-semibold">{stats.pending_verifications}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Verified</div>
              <div className="text-lg font-semibold">{stats.verified_users}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Avg Review (hrs)</div>
              <div className="text-lg font-semibold">{stats.avg_verification_hours}</div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Pending Verifications ({pending.length})</h2>
        <div className="grid gap-3">
          {pending.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-sm text-muted-foreground">All caught up! 🎉</CardContent>
            </Card>
          )}
          {pending.map((u) => (
            <Card key={u.id}>
              <CardContent className="pt-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{u.nickname || "Anonymous"}</div>
                  <div className="text-sm text-muted-foreground truncate">{u.email}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => approve(u.id)}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => reject(u.id)}>Reject</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Moderation</h2>
        <Card>
          <CardContent className="pt-6 grid gap-4">
            <div className="flex gap-2 items-start">
              <Input placeholder="Story ID" value={storyId} onChange={(e) => setStoryId(e.target.value)} />
              <Button variant="destructive" onClick={deleteStory} disabled={isPending}>Delete Story</Button>
            </div>
            <div className="flex gap-2 items-start">
              <Input placeholder="Comment ID" value={commentId} onChange={(e) => setCommentId(e.target.value)} />
              <Button variant="destructive" onClick={deleteComment} disabled={isPending}>Delete Comment</Button>
            </div>
            <div className="flex gap-2 items-start">
              <Input placeholder="New story text" value={storyText} onChange={(e) => setStoryText(e.target.value)} />
              <Button onClick={updateStoryText} disabled={isPending || !storyId.trim() || !storyText.trim()}>Update Story Text</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

