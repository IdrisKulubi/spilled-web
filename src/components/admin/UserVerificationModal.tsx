"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  CheckCircle, 
  XCircle,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PendingUser {
  id: string;
  email: string | null;
  nickname: string | null;
  phone: string | null;
  idImageUrl: string | null;
  idType: string | null;
  createdAt: string | null;
}

interface UserVerificationModalProps {
  user: PendingUser | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (userId: string) => void;
  onReject: (userId: string, reason: string) => void;
  isPending?: boolean;
}

export default function UserVerificationModal({
  user,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isPending = false
}: UserVerificationModalProps) {
  const [rejectionReason, setRejectionReason] = useState("ID verification failed");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

  const handleClose = () => {
    setShowRejectForm(false);
    setRejectionReason("ID verification failed");
    setImageError(false);
    setImageZoomed(false);
    onClose();
  };

  const handleApprove = () => {
    if (user) {
      onApprove(user.id);
      handleClose();
    }
  };

  const handleReject = () => {
    if (user && rejectionReason.trim()) {
      onReject(user.id, rejectionReason);
      handleClose();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            User Verification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info Header */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              <AvatarImage src={undefined} alt={user.nickname || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 text-xl font-bold">
                {user.nickname?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{user.nickname || "Anonymous"}</h3>
                <Badge variant="outline" className="text-xs">
                  Pending Verification
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {user.email && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.createdAt && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Applied {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                )}
                {user.idType && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>ID Type: {user.idType}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User ID */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="font-semibold">User ID</Label>
              <Badge variant="secondary" className="font-mono text-xs">
                {user.id}
              </Badge>
            </div>
          </div>

          {/* ID Document Image */}
          <div className="space-y-3">
            <Label className="font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              ID Document
            </Label>
            
            {user.idImageUrl ? (
              <div className="relative">
                <div 
                  className={`border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 ${
                    imageZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={() => setImageZoomed(!imageZoomed)}
                >
                  {!imageError ? (
                    <img
                      src={user.idImageUrl}
                      alt="ID Document"
                      className={`w-full ${imageZoomed ? 'max-h-none' : 'max-h-[400px]'} object-contain`}
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <AlertCircle className="h-12 w-12 mb-2" />
                      <p className="text-sm">Failed to load ID image</p>
                      <p className="text-xs mt-1">URL: {user.idImageUrl}</p>
                    </div>
                  )}
                </div>
                {!imageError && !imageZoomed && (
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    Click to zoom
                  </p>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">No ID document uploaded</p>
              </div>
            )}
          </div>

          {/* Rejection Reason Form (shown when reject is clicked) */}
          {showRejectForm && (
            <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <Label className="text-red-700">Rejection Reason</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="min-h-[80px]"
              />
            </div>
          )}

          {/* Important Notes */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-xs text-yellow-800 space-y-1">
                <p className="font-semibold">Verification Guidelines:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Verify the ID document is clear and legible</li>
                  <li>Check that the name matches the provided information</li>
                  <li>Ensure the ID is valid and not expired</li>
                  <li>Confirm the photo matches the document</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {!showRejectForm ? (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowRejectForm(true)}
                disabled={isPending}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isPending}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setShowRejectForm(false)}
                disabled={isPending}
              >
                Back
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isPending || !rejectionReason.trim()}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Confirm Rejection
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
