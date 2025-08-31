"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Plus, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getUserConversations, getConversation, sendMessage, getCurrentUser } from "@/lib/actions/chat";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Conversation {
  userId: string;
  userName: string | null;
  userNickname: string | null;
  userImage: string | null;
  lastMessage: string;
  lastMessageTime: string;
  isFromCurrentUser: boolean;
}

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

export function ChatPageClient() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadCurrentUser();
    loadConversations();
  }, []);

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

  const loadConversations = async () => {
    try {
      setLoading(true);
      const result = await getUserConversations();
      if (result.success) {
        setConversations(result.data);
      } else {
        toast.error("Failed to load conversations");
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    try {
      setLoadingMessages(true);
      const result = await getConversation(otherUserId);
      if (result.success) {
        setMessages(result.data);
      } else {
        toast.error("Failed to load messages");
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      toast.error("Something went wrong");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.userId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;
    
    const messageContent = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const result = await sendMessage(selectedConversation.userId, messageContent);
      
      if (result.success && result.data) {
        // Add the new message to the list optimistically
        const newMsg: Message = {
          id: result.data.id || Date.now().toString(),
          senderId: currentUser?.id || "",
          receiverId: selectedConversation.userId,
          content: messageContent,
          createdAt: new Date().toISOString(),
          senderName: currentUser?.name || null,
          senderNickname: currentUser?.nickname || null,
          senderImage: null,
        };
        
        setMessages(prev => [...prev, newMsg]);
        
        // Refresh conversations to update last message
        loadConversations();
      } else {
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

  const getDisplayName = (conversation: Conversation) => {
    return conversation.userNickname || conversation.userName || "Anonymous User";
  };

  const isFromCurrentUser = (message: Message) => {
    return currentUser && message.senderId === currentUser.id;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List Skeleton */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-full p-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area Skeleton */}
        <Card className="md:col-span-2 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Loading conversations...</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we load your messages
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {conversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-sm text-muted-foreground">
                No conversations yet. Start by clicking on a user's profile from a story!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation.userId}
                  onClick={() => handleConversationClick(conversation)}
                  className={cn(
                    "w-full p-3 text-left hover:bg-muted/50 transition-colors border-b border-gray-100",
                    selectedConversation?.userId === conversation.userId && "bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.userImage || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 text-sm">
                        {getDisplayName(conversation).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {getDisplayName(conversation)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.isFromCurrentUser ? "You: " : ""}{conversation.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="md:col-span-2 flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedConversation.userImage || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 text-sm">
                    {getDisplayName(selectedConversation).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{getDisplayName(selectedConversation)}</p>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="space-y-4">
                  {/* Message Skeleton - from other user */}
                  <div className="flex gap-2 justify-start">
                    <Skeleton className="h-6 w-6 rounded-full mt-1" />
                    <div className="max-w-[75%] space-y-1">
                      <Skeleton className="h-12 w-48 rounded-lg" />
                    </div>
                  </div>
                  
                  {/* Message Skeleton - from current user */}
                  <div className="flex gap-2 justify-end">
                    <div className="max-w-[75%] space-y-1">
                      <Skeleton className="h-8 w-32 rounded-lg" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded-full mt-1" />
                  </div>
                  
                  {/* Another message skeleton - from other user */}
                  <div className="flex gap-2 justify-start">
                    <Skeleton className="h-6 w-6 rounded-full mt-1" />
                    <div className="max-w-[75%] space-y-1">
                      <Skeleton className="h-16 w-56 rounded-lg" />
                    </div>
                  </div>
                  
                  {/* Another message skeleton - from current user */}
                  <div className="flex gap-2 justify-end">
                    <div className="max-w-[75%] space-y-1">
                      <Skeleton className="h-10 w-40 rounded-lg" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded-full mt-1" />
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">👋</div>
                  <p className="text-sm text-muted-foreground">
                    Start the conversation with {getDisplayName(selectedConversation)}!
                  </p>
                </div>
              ) : (
                messages.map((message) => {
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
                        <Avatar className="h-6 w-6 mt-1">
                          <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 text-xs">
                            {selectedConversation.userNickname?.charAt(0)?.toUpperCase() ||
                             selectedConversation.userName?.charAt(0)?.toUpperCase() ||
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
                            "text-xs mt-1",
                            isOwn
                              ? "text-primary-foreground/70 text-right"
                              : "text-muted-foreground"
                          )}
                        >
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </p>
                      </div>

                      {isOwn && (
                        <Avatar className="h-6 w-6 mt-1">
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 text-xs">
                            You
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>

            {/* Input Area */}
            <div className="border-t p-4">
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
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">
                Choose a conversation from the left to start messaging
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
