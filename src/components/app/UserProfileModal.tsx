"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, User, Calendar, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getUserProfile, getCurrentUser } from "@/lib/actions/chat";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type UserProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onStartChat: (userId: string, userName: string) => void;
};

interface UserProfile {
  id: string;
  name: string | null;
  nickname: string | null;
  image: string | null;
  createdAt: Date | null;
}

export function UserProfileModal({ isOpen, onClose, userId, onStartChat }: UserProfileModalProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      loadUserProfile();
    }
  }, [isOpen, userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load both user profile and current user in parallel
      const [userResult, currentUserResult] = await Promise.all([
        getUserProfile(userId),
        getCurrentUser()
      ]);
      
      if (userResult.success && userResult.data) {
        setUserProfile(userResult.data);
      } else {
        setError(userResult.error || "Failed to load user profile");
        return;
      }
      
      if (currentUserResult.success && currentUserResult.data) {
        setCurrentUserId(currentUserResult.data.id);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = () => {
    if (userProfile) {
      const displayName = userProfile.nickname || userProfile.name || "Unknown User";
      onStartChat(userProfile.id, displayName);
      onClose();
      toast.success(`Starting chat with ${displayName}`);
    }
  };

  const handleClose = () => {
    setUserProfile(null);
    setCurrentUserId(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="space-y-6">
            {/* Profile Header Skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-28 rounded-full" />
              </div>
            </div>

            {/* Profile Info Skeleton */}
            <div className="space-y-3 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>

            {/* Privacy Note Skeleton */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-2xl mb-2">😞</div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={loadUserProfile}>
              Try Again
            </Button>
          </div>
        )}

        {userProfile && !loading && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-white shadow-lg">
                <AvatarImage src={userProfile.image || undefined} alt={userProfile.name || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 text-xl font-bold">
                  {userProfile.name?.charAt(0)?.toUpperCase() || 
                   userProfile.nickname?.charAt(0)?.toUpperCase() || 
                   "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {userProfile.nickname || userProfile.name || "Anonymous User"}
                </h3>
                {userProfile.name && userProfile.nickname && userProfile.name !== userProfile.nickname && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {userProfile.name}
                  </p>
                )}
                <Badge variant="secondary" className="mt-2">
                  Community Member
                </Badge>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-3 py-4 border-t border-gray-100">
              {userProfile.createdAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined {formatDistanceToNow(userProfile.createdAt, { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              {currentUserId && userProfile.id === currentUserId ? (
                // Show different content for own profile
                <div className="flex-1">
                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">This is your profile</p>
                  </div>
                </div>
              ) : (
                // Show Start Chat button for other users
                <Button onClick={handleStartChat} className="flex-1 gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Start Chat
                </Button>
              )}
              <Button variant="outline" onClick={handleClose} className="gap-2">
                <X className="h-4 w-4" />
                Close
              </Button>
            </div>

            {/* Privacy Note */}
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700">
                🔐 Messages are private and secure. Be respectful in your conversations.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
