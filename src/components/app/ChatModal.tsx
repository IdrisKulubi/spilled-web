"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, X, MessageCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sendMessage, getConversation, getCurrentUser } from "@/lib/actions/chat";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type ChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
};

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  senderName: string | null;
  senderNickname: string | null;
  senderImage: string | null;
}

interface CurrentUser {
  id: string;
  name?: string | null;
  nickname?: string | null;
}

export function ChatModal({ isOpen, onClose, recipientId, recipientName }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && recipientId) {
      loadCurrentUser();
      loadConversation();
    }
  }, [isOpen, recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadCurrentUser = async () => {
    try {
      const result = await getCurrentUser();
      if (result.success && result.data) {
        setCurrentUser(result.data);
      }
    } catch (err) {
      console.error('Failed to load current user:', err);
    }
  };

  const loadConversation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getConversation(recipientId);
      if (result.success) {
        setMessages(result.data);
      } else {
        setError(result.error || "Failed to load conversation");
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    
    const messageContent = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const result = await sendMessage(recipientId, messageContent);
      
      if (result.success && result.data) {
        // Add the new message to the list optimistically
        const newMsg: Message = {
          id: result.data.id || Date.now().toString(),
          senderId: currentUser?.id || "",
          receiverId: recipientId,
          content: messageContent,
          createdAt: new Date().toISOString(),
          senderName: currentUser?.name || null,
          senderNickname: currentUser?.nickname || null,
          senderImage: null,
        };
        
        setMessages(prev => [...prev, newMsg]);
        toast.success("Message sent!");
      } else {
        setError(result.error || "Failed to send message");
        setNewMessage(messageContent); // Restore message on error
        toast.error("Failed to send message");
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setNewMessage(messageContent); // Restore message on error
      toast.error("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setMessages([]);
    setNewMessage("");
    setError(null);
    onClose();
  };

  const isFromCurrentUser = (message: Message) => {
    return currentUser && message.senderId === currentUser.id;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5" />
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 text-sm">
                  {recipientName?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{recipientName}</span>
            </div>
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-4 top-4 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {loading && (
            <div className="space-y-4">
              {/* Message Skeleton - from other user */}
              <div className="flex gap-2 justify-start">
                <Skeleton className="h-7 w-7 rounded-full mt-1" />
                <div className="max-w-[75%] space-y-2">
                  <Skeleton className="h-16 w-48 rounded-lg" />
                </div>
              </div>
              
              {/* Message Skeleton - from current user */}
              <div className="flex gap-2 justify-end">
                <div className="max-w-[75%] space-y-2">
                  <Skeleton className="h-12 w-32 rounded-lg" />
                </div>
                <Skeleton className="h-7 w-7 rounded-full mt-1" />
              </div>
              
              {/* Another message skeleton - from other user */}
              <div className="flex gap-2 justify-start">
                <Skeleton className="h-7 w-7 rounded-full mt-1" />
                <div className="max-w-[75%] space-y-2">
                  <Skeleton className="h-20 w-56 rounded-lg" />
                </div>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">😞</div>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={loadConversation}>
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && messages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}

          {messages.map((message) => {
            const isOwn = isFromCurrentUser(message);
            
            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  isOwn ? "justify-end" : "justify-start"
                )}
              >
                {!isOwn && (
                  <Avatar className="h-7 w-7 mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 text-xs">
                      {message.senderName?.charAt(0)?.toUpperCase() ||
                       message.senderNickname?.charAt(0)?.toUpperCase() ||
                       "?"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3 py-2",
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-1 flex items-center gap-1",
                      isOwn
                        ? "text-primary-foreground/70 justify-end"
                        : "text-muted-foreground"
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </p>
                </div>

                {isOwn && (
                  <Avatar className="h-7 w-7 mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 text-xs">
                      {currentUser?.name?.charAt(0)?.toUpperCase() ||
                       currentUser?.nickname?.charAt(0)?.toUpperCase() ||
                       "You"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t px-4 py-3">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={sending}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send • Messages are private and secure
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
