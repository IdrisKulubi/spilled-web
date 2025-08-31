"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Feature } from "@/lib/types";
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

export const FeatureCard = React.memo(
  ({
    feature,
    index,
    hovered,
    setHovered,
  }: {
    feature: Feature & { icon?: LucideIcon };
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => {
    const IconComponent = feature.icon || iconMap[feature.iconName] || Shield;
    const isAvailable = feature.status === 'available';

    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "relative rounded-2xl shadow-lg transition-all duration-300 ease-out border-0 cursor-pointer",
          "focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2",
          hovered !== null && hovered !== index && "blur-sm scale-[0.98] opacity-60",
          hovered === index && "scale-[1.02] shadow-2xl"
        )}
        style={{ 
          backgroundColor: '#FDECEF',
          boxShadow: hovered === index 
            ? '0 25px 50px rgba(217, 107, 160, 0.3)' 
            : '0 4px 20px rgba(217, 107, 160, 0.1)'
        }}
        role="listitem"
        tabIndex={0}
        aria-labelledby={`feature-${feature.id}-title`}
        aria-describedby={`feature-${feature.id}-description`}
      >
        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div 
              className={cn(
                "p-3 rounded-lg transition-all duration-300",
                hovered === index && "scale-110 rotate-3"
              )}
              style={{ 
                backgroundColor: isAvailable ? '#76C893' : '#D96BA0',
                color: '#FFFFFF'
              }}
              aria-hidden="true"
            >
              <IconComponent className="h-6 w-6" />
            </div>
            <Badge 
              variant="secondary"
              className={cn(
                "text-xs font-medium rounded-lg px-2 py-1 shrink-0 transition-all duration-300",
                hovered === index && "scale-105"
              )}
              style={{
                backgroundColor: isAvailable ? '#76C893' : '#F25F5C',
                color: '#FFFFFF'
              }}
              aria-label={`Feature status: ${isAvailable ? 'Available now' : 'Coming soon'}`}
            >
              {isAvailable ? 'Available' : 'Coming Soon'}
            </Badge>
          </div>

          {/* Title */}
          <h3 
            id={`feature-${feature.id}-title`}
            className={cn(
              "text-xl font-semibold leading-tight mb-3 transition-all duration-300",
              hovered === index && "text-pink-700"
            )}
            style={{ color: hovered === index ? undefined : '#3B3B3B' }}
          >
            {feature.title}
          </h3>

          {/* Description */}
          <p 
            id={`feature-${feature.id}-description`}
            className={cn(
              "text-base leading-relaxed transition-all duration-300",
              hovered === index && "text-gray-700"
            )}
            style={{ color: hovered === index ? undefined : '#3B3B3B' }}
          >
            {feature.description}
          </p>
        </div>

        {/* Hover overlay effect */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-pink-500/10 to-pink-600/20 rounded-2xl transition-opacity duration-300",
            hovered === index ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Animated border */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl border-2 border-pink-400 transition-opacity duration-300",
            hovered === index ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

export function FocusFeatureCards({ features }: { features: Feature[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.id}
          feature={feature}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
