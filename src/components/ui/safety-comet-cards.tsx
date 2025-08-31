"use client";

import React from "react";
import { CometCard } from "@/components/ui/comet-card";
import type { SafetyFeature } from "@/lib/types";
import { Shield, Users, MessageSquare, CheckCircle, Search, AlertTriangle, FileText, Eye, UserCheck, Lock, LucideIcon } from "lucide-react";

// Icon mapping to avoid serialization issues
const iconMap: Record<string, LucideIcon> = {
  CheckCircle,
  Search,
  AlertTriangle,
  FileText,
  Eye,
  Shield,
  UserCheck,
  Users,
  MessageSquare,
  Lock,
};

export interface SafetyCometCardProps {
  feature: SafetyFeature;
  index: number;
}

const SafetyCometCard = ({ feature, index }: SafetyCometCardProps) => {
  const IconComponent = iconMap[feature.iconName] || Shield;
  
  // Stagger the cards with different colors and gradients
  const cardStyles = [
    {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      iconColor: "#ffffff",
      textColor: "#ffffff",
      accent: "#667eea"
    },
    {
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      iconColor: "#ffffff", 
      textColor: "#ffffff",
      accent: "#f093fb"
    },
    {
      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      iconColor: "#ffffff",
      textColor: "#ffffff", 
      accent: "#4facfe"
    },
    {
      background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      iconColor: "#ffffff",
      textColor: "#ffffff",
      accent: "#43e97b"
    },
    {
      background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      iconColor: "#ffffff",
      textColor: "#ffffff",
      accent: "#fa709a"
    }
  ];

  const style = cardStyles[index % cardStyles.length];

  return (
    <CometCard 
      rotateDepth={12} 
      translateDepth={15}
      className="w-full h-full"
    >
      <div
        className="relative overflow-hidden rounded-2xl p-6 h-full flex flex-col justify-between min-h-[280px] cursor-pointer"
        style={{ 
          background: style.background,
          backdropFilter: "blur(10px)"
        }}
      >
        {/* Decorative background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, ${style.accent} 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, ${style.accent} 0%, transparent 50%),
                              radial-gradient(circle at 40% 40%, ${style.accent} 0%, transparent 50%)`
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="mb-4">
            <div 
              className="inline-flex p-3 rounded-xl bg-white/20 backdrop-blur-sm"
              style={{ boxShadow: `0 8px 32px ${style.accent}30` }}
            >
              <IconComponent 
                className="w-8 h-8" 
                style={{ color: style.iconColor }}
              />
            </div>
          </div>

          {/* Title */}
          <h3 
            className="text-xl font-bold mb-3 leading-tight"
            style={{ color: style.textColor }}
          >
            {feature.title}
          </h3>

          {/* Description */}
          <p 
            className="text-sm leading-relaxed opacity-90"
            style={{ color: style.textColor }}
          >
            {feature.description}
          </p>
        </div>

        {/* Bottom accent */}
        <div className="relative z-10 mt-4">
          <div 
            className="h-1 w-16 rounded-full bg-white/30"
            style={{ boxShadow: `0 0 20px ${style.accent}50` }}
          />
        </div>

        {/* Floating orb decoration */}
        <div 
          className="absolute top-4 right-4 w-12 h-12 rounded-full opacity-20"
          style={{ 
            background: `radial-gradient(circle, ${style.accent} 0%, transparent 70%)`,
            filter: "blur(8px)"
          }}
        />
      </div>
    </CometCard>
  );
};

export interface SafetyCometCardsProps {
  features: SafetyFeature[];
}

export function SafetyCometCards({ features }: SafetyCometCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
      {features.map((feature, index) => (
        <div key={feature.title} className="flex">
          <SafetyCometCard feature={feature} index={index} />
        </div>
      ))}
    </div>
  );
}

export default SafetyCometCards;
