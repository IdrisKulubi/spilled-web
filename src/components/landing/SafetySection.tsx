"use client";

import { SafetyCometCards } from "@/components/ui/safety-comet-cards";
import type { SafetySectionProps } from "@/lib/types";
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

export function SafetySection({ content, className }: SafetySectionProps) {
  return (
    <section 
      className={`py-16 sm:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 lg:px-8 ${className || ''}`} 
      style={{ backgroundColor: '#FFF8F9' }}
      aria-labelledby="safety-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 
            id="safety-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2"
            style={{ color: '#3B3B3B' }}
          >
            {content.title}
          </h2>
          <p 
            className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4"
            style={{ color: '#3B3B3B' }}
            aria-describedby="safety-heading"
          >
            {content.subtitle}
          </p>
        </div>
        
        <div role="list" aria-label="Safety features">
          <SafetyCometCards features={content.features} />
        </div>
        
        {/* Trust indicators */}
        <div className="mt-12 sm:mt-16 text-center">
          <div 
            className="inline-flex flex-wrap justify-center items-center gap-3 sm:gap-6 px-4 sm:px-8 py-3 sm:py-4 rounded-2xl mx-4"
            style={{ backgroundColor: '#FDECEF' }}
          >
            <div className="flex items-center">
              
              <span 
                className="text-xs sm:text-sm font-medium whitespace-nowrap"
                style={{ color: '#3B3B3B' }}
              >
                100% Women-Only Platform
              </span>
            </div>
            <div className="flex items-center">
            
              <span 
                className="text-xs sm:text-sm font-medium whitespace-nowrap"
                style={{ color: '#3B3B3B' }}
              >
                End-to-End Encrypted
              </span>
            </div>
            <div className="flex items-center">
            
              <span 
                className="text-xs sm:text-sm font-medium whitespace-nowrap"
                style={{ color: '#3B3B3B' }}
              >
                ID Verified Users Only
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}