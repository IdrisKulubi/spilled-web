"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { FeaturesSectionProps } from "@/lib/types";
import ThreeDCardDemo, { SafetyCard, CommunityCard, MessagingCard } from "@/components/ui/3d-card-demo";
import { FocusFeatureCards } from "@/components/ui/focus-feature-cards";
import { Shield, Users, MessageSquare, CheckCircle, Search, AlertTriangle, FileText, Eye, UserCheck, Lock } from "lucide-react";

// Icon mapping to avoid serialization issues
const iconMap = {
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

export function FeaturesSection({ content, className }: FeaturesSectionProps) {
  // Transform features to include proper icon components
  const featuresWithIcons = content.features.map(feature => ({
    ...feature,
    icon: iconMap[feature.iconName as keyof typeof iconMap] || Shield
  }));
  return (
    <section 
      className={`py-16 sm:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 lg:px-8 ${className || ''}`}
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 
            id="features-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2"
            style={{ color: '#3B3B3B' }}
          >
            {content.title}
          </h2>
          <p 
            className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4"
            style={{ color: '#3B3B3B' }}
            aria-describedby="features-heading"
          >
            {content.subtitle}
          </p>
          
          <div className="mt-6 sm:mt-8">
            <Link href="/signup">
              <Button 
                size="lg"
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                style={{
                  backgroundColor: '#D96BA0',
                  color: '#FFFFFF'
                }}
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Highlight 3D Cards Section */}
        <div className="mb-16 sm:mb-20">
          <h3 className="text-xl sm:text-2xl font-semibold text-center mb-8 sm:mb-12" style={{ color: '#3B3B3B' }}>
            Experience Our Core Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            <ThreeDCardDemo
              title="Verified & Safe"
              description="All users undergo identity verification and background checks to ensure a secure environment"
              features={["ID verification required", "Background checks", "Women-only platform", "Secure data protection"]}
              primaryAction={{ label: "Get Verified", href: "/signin" }}
              secondaryAction={{ label: "Learn More", href: "#safety" }}
            />
            <ThreeDCardDemo
              title="Supportive Community"
              description="Connect with women who understand your experiences and are ready to offer support"
              features={["Share experiences", "Get advice & support", "Anonymous posting", "Trusted community"]}
              primaryAction={{ label: "Join Now", href: "/signin" }}
              secondaryAction={{ label: "Explore", href: "#features" }}
            />
            <div className="md:col-span-2 lg:col-span-1 flex justify-center">
              <ThreeDCardDemo
                title="Private Messaging"
                description="Secure, encrypted messaging to connect privately with other verified community members"
                features={["End-to-end encryption", "Private conversations", "Verified users only", "Safe communication"]}
                primaryAction={{ label: "Start Chat", href: "/signin" }}
                secondaryAction={{ label: "Privacy", href: "#support" }}
              />
            </div>
          </div>
        </div>
        
        {/* All Features Grid with Focus Effect */}
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-center mb-8 sm:mb-12" style={{ color: '#3B3B3B' }}>
            All Platform Features
          </h3>
          <div role="list" aria-label="Platform features">
            <FocusFeatureCards features={featuresWithIcons} />
          </div>
        </div>
      </div>
    </section>
  );
}