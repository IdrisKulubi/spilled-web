"use client";

import {  useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, Shield, Clock } from "lucide-react";
import { adminListPending, adminApproveUser, adminRejectUser, adminFetchStats, adminDeleteStory, adminDeleteComment, adminUpdateStoryText } from "@/lib/actions/admin";
import UserVerificationModal from "./UserVerificationModal";
import { toast } from "sonner";

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
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refresh = async () => {
    try {
      const [p, s] = await Promise.all([adminListPending(100, 0), adminFetchStats()]);
      setPending((p as any).data || []);
      setStats((s as any).data || null);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  };

  const handleRefresh = () => {
    startTransition(() => {
      refresh();
    });
  };

  const approve = (userId: string) => {
    startTransition(async () => {
      try {
        const result = await adminApproveUser(userId);
        if (result?.success) {
          toast.success("User approved successfully");
          await refresh();
        } else {
          toast.error("Failed to approve user");
          console.error("Failed to approve user");
        }
      } catch (error) {
        toast.error("Error approving user");
        console.error("Error approving user:", error);
      }
    });
  };

  const reject = (userId: string, reason: string) => {
    startTransition(async () => {
      try {
        const result = await adminRejectUser(userId, reason || "ID verification failed");
        if (result?.success) {
          toast.success("User rejected");
          await refresh();
        } else {
          toast.error("Failed to reject user");
          console.error("Failed to reject user");
        }
      } catch (error) {
        toast.error("Error rejecting user");
        console.error("Error rejecting user:", error);
      }
    });
  };

  const openUserModal = (user: PendingUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const [storyId, setStoryId] = useState("");
  const [commentId, setCommentId] = useState("");
  const [storyText, setStoryText] = useState("");

  const deleteStory = () => {
    if (!storyId.trim()) return;
    startTransition(async () => {
      try {
        const result = await adminDeleteStory(storyId.trim());
        if (result?.success) {
          toast.success("Story deleted successfully");
          setStoryId("");
        } else {
          toast.error("Failed to delete story");
        }
      } catch (error) {
        toast.error("Error deleting story");
        console.error("Error deleting story:", error);
      }
    });
  };

  const updateStoryText = () => {
    if (!storyId.trim() || !storyText.trim()) return;
    startTransition(async () => {
      try {
        const result = await adminUpdateStoryText(storyId.trim(), storyText.trim());
        if (result?.success) {
          toast.success("Story updated successfully");
          setStoryText("");
        } else {
          toast.error("Failed to update story");
        }
      } catch (error) {
        toast.error("Error updating story");
        console.error("Error updating story:", error);
      }
    });
  };

  const deleteComment = () => {
    if (!commentId.trim()) return;
    startTransition(async () => {
      try {
        const result = await adminDeleteComment(commentId.trim());
        if (result?.success) {
          toast.success("Comment deleted successfully");
          setCommentId("");
        } else {
          toast.error("Failed to delete comment");
        }
      } catch (error) {
        toast.error("Error deleting comment");
        console.error("Error deleting comment:", error);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleRefresh} disabled={isPending}>{isPending ? "Refreshing..." : "Refresh"}</Button>
      </div>

      {stats && (
        <Card>
          <CardContent className="pt-6 grid sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Pending</div>
                <div className="text-lg font-semibold">{stats.pending_verifications}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Verified</div>
                <div className="text-lg font-semibold">{stats.verified_users}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Avg Review (hrs)</div>
                <div className="text-lg font-semibold">{stats.avg_verification_hours}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pending Verifications</h2>
          <Badge variant="secondary" className="text-sm">
            {pending.length} {pending.length === 1 ? 'user' : 'users'} pending
          </Badge>
        </div>
        <div className="grid gap-3">
          {pending.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-sm text-muted-foreground">All caught up! 🎉</CardContent>
            </Card>
          )}
          {pending.map((u) => (
            <Card key={u.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openUserModal(u)}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium truncate">{u.nickname || "Anonymous"}</div>
                      {u.idImageUrl && (
                        <Badge variant="outline" className="text-xs">
                          ID Uploaded
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">{u.email}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ID: <span className="font-mono">{u.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        openUserModal(u);
                      }}
                      className="gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      View Details
                    </Button>
                  </div>
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

      {/* User Verification Modal */}
      <UserVerificationModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={approve}
        onReject={reject}
        isPending={isPending}
      />
    </div>
  );
}

