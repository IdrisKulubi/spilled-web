"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle, Sparkles, Heart, Trash2 } from "lucide-react";

type ToastType = 'success' | 'error' | 'warning' | 'reaction' | 'comment';

interface CustomToastProps {
  type: ToastType;
  message: string;
  reactionType?: 'red_flag' | 'good_vibes' | 'unsure';
  action?: 'added' | 'removed' | 'switched';
}

const genZMessages = {
  reaction: {
    red_flag: {
      added: ["Red flag spotted! 🚩", "That's sus energy fr 🚩✨", "Major red flag vibes 🚩", "Yikes detected! 🚩💀"],
      removed: ["Red flag removed bestie 💅", "Unflagged that energy ✨", "Changed your mind? Valid 🚩❌"],
      switched: ["Switched to red flag! 🚩", "New vibe check: sus! 🚩"]
    },
    good_vibes: {
      added: ["Good vibes only ✅ 💫", "That's the energy ✅ 🌟", "Serving good vibes ✅ 💅", "Main character energy! ✨👑"],
      removed: ["Vibes retracted bestie 💫", "Changed the energy ✨", "Vibe check reversed! 💫❌"],
      switched: ["Switched to good vibes! ✨", "New energy: immaculate! ✨"]
    },
    unsure: {
      added: ["It's giving confused 🤔💭", "Unsure energy activated 🤷‍♀️", "That's a whole mood 🤔✨", "Big question mark energy 🤔"],
      removed: ["Clarity achieved! 🤔❌", "No longer confused bestie 💭", "Unsure energy cancelled ✨"],
      switched: ["Switched to unsure! 🤔", "New vibe: confused energy 🤷‍♀️"]
    }
  },
  comment: {
    added: ["Comment posted! Let's go 💬✨", "Spilled the tea successfully! ☕💅", "Your thoughts = delivered 💬🚀", "Said what needed to be said! 💬👑"],
    error: ["Comment failed to send bestie 😭", "Tea didn't spill properly 😭☕", "Technical difficulties fr 💀", "Try again queen! 💅✨"]
  },
  generic: {
    success: ["Success! That's what we like ✨", "Periodt ✨💅", "Ate that up! 🔥", "Serving excellence! 👑"],
    error: ["Oops! Something went wrong 😭", "Not the technical difficulties! 💀", "This ain't it chief 😭✨", "Error era activated 💀"],
    warning: ["Heads up bestie! ⚠️", "Plot twist incoming! ⚠️✨", "Attention required! 👀"]
  }
};

const getRandomMessage = (type: string, category?: string, action?: string): string => {
  if (type === 'reaction' && category && action) {
    const messages = genZMessages.reaction[category as keyof typeof genZMessages.reaction]?.[action as keyof typeof genZMessages.reaction.red_flag];
    return messages ? messages[Math.floor(Math.random() * messages.length)] : "Reaction updated! ✨";
  }
  
  if (type === 'comment') {
    const messages = action === 'error' ? genZMessages.comment.error : genZMessages.comment.added;
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  const genericMessages = genZMessages.generic[type as keyof typeof genZMessages.generic];
  return genericMessages ? genericMessages[Math.floor(Math.random() * genericMessages.length)] : "Done! ✨";
};

const getToastIcon = (type: ToastType, reactionType?: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="h-5 w-5" />;
    case 'error':
      return <XCircle className="h-5 w-5" />;
    case 'warning':
      return <AlertCircle className="h-5 w-5" />;
    case 'reaction':
      switch (reactionType) {
        case 'red_flag':
          return <span className="text-lg">🚩</span>;
        case 'good_vibes':
          return <Sparkles className="h-5 w-5" />;
        case 'unsure':
          return <span className="text-lg">🤔</span>;
        default:
          return <Heart className="h-5 w-5" />;
      }
    case 'comment':
      return <span className="text-lg">💬</span>;
    default:
      return <CheckCircle2 className="h-5 w-5" />;
  }
};

const getToastStyles = (type: ToastType, reactionType?: string) => {
  const baseStyles = "flex items-center gap-3 p-4 rounded-2xl border-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105";
  
  switch (type) {
    case 'success':
      return cn(baseStyles, "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800");
    case 'error':
      return cn(baseStyles, "bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-800");
    case 'warning':
      return cn(baseStyles, "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 text-yellow-800");
    case 'reaction':
      switch (reactionType) {
        case 'red_flag':
          return cn(baseStyles, "bg-gradient-to-r from-red-50 via-pink-50 to-red-50 border-red-200 text-red-700");
        case 'good_vibes':
          return cn(baseStyles, "bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-200 text-green-700");
        case 'unsure':
          return cn(baseStyles, "bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-yellow-200 text-yellow-700");
        default:
          return cn(baseStyles, "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700");
      }
    case 'comment':
      return cn(baseStyles, "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 text-blue-700");
    default:
      return cn(baseStyles, "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700");
  }
};

export function CustomToast({ type, message, reactionType, action }: CustomToastProps) {
  const dynamicMessage = type === 'reaction' 
    ? getRandomMessage('reaction', reactionType, action)
    : type === 'comment' 
    ? getRandomMessage('comment', undefined, action)
    : message;

  return (
    <div className={getToastStyles(type, reactionType)}>
      <div className="flex-shrink-0">
        {getToastIcon(type, reactionType)}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium leading-relaxed">
          {dynamicMessage}
        </p>
      </div>
      <div className="flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-current opacity-60 animate-pulse"></div>
      </div>
    </div>
  );
}

// Helper functions to show custom toasts
export const showReactionToast = (reactionType: 'red_flag' | 'good_vibes' | 'unsure', action: 'added' | 'removed' | 'switched') => {
  return {
    type: 'reaction' as const,
    reactionType,
    action,
    message: getRandomMessage('reaction', reactionType, action)
  };
};

export const showCommentToast = (success: boolean) => {
  return {
    type: 'comment' as const,
    action: success ? 'added' : 'error',
    message: getRandomMessage('comment', undefined, success ? 'added' : 'error')
  };
};

export const showGenericToast = (type: 'success' | 'error' | 'warning', customMessage?: string) => {
  return {
    type,
    message: customMessage || getRandomMessage(type)
  };
};
