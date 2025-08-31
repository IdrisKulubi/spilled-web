"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export interface ThreeDCardDemoProps {
  title?: string;
  description?: string;
  features?: string[];
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  icon?: React.ReactNode;
}

export default function ThreeDCardDemo({
  title = "Share Your Story Safely",
  description = "Connect with a supportive community of women while maintaining your privacy and security",
  features = ["Anonymous sharing", "Verified users only", "Secure platform"],
  primaryAction = { label: "Join Community", href: "/signin" },
  secondaryAction = { label: "Learn More →", href: "#features" },
}: ThreeDCardDemoProps) {
  return (
    <CardContainer className="inter-var" containerClassName="py-8">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-pink-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full max-w-sm h-auto rounded-xl p-6 border">
        <CardItem
          translateZ="50"
          className="flex items-center gap-3 text-lg font-bold text-neutral-600 dark:text-white mb-4"
        >
          <span className="text-base sm:text-lg">{title}</span>
        </CardItem>
        
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm leading-relaxed mb-6 dark:text-neutral-300"
        >
          {description}
        </CardItem>
        
        <CardItem translateZ="80" className="w-full mb-6">
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardItem>
        
        <div className="flex justify-between items-center gap-2">
          <CardItem
            translateZ={20}
            as={secondaryAction.href ? "a" : "button"}
            href={secondaryAction.href}
            onClick={secondaryAction.onClick}
            className="px-3 py-2 rounded-lg text-xs font-normal dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex-1 text-center"
          >
            {secondaryAction.label}
          </CardItem>
          <CardItem
            translateZ={20}
            as={primaryAction.href ? "a" : "button"}
            href={primaryAction.href}
            onClick={primaryAction.onClick}
            className="px-3 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-700 text-white text-xs font-bold transition-colors cursor-pointer flex-1 text-center"
          >
            {primaryAction.label}
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}

// Pre-configured variants for common use cases
export const SafetyCard = () => (
  <ThreeDCardDemo
    title="Verified & Safe"
    description="All users undergo identity verification and background checks to ensure a secure environment"
    features={["ID verification required", "Background checks", "Women-only platform", "Secure data protection"]}
    primaryAction={{ label: "Get Verified", href: "/signin" }}
    secondaryAction={{ label: "Learn More", href: "#safety" }}
  />
);

export const CommunityCard = () => (
  <ThreeDCardDemo
    title="Supportive Community"
    description="Connect with women who understand your experiences and are ready to offer support"
    features={["Share experiences", "Get advice & support", "Anonymous posting", "Trusted community"]}
    primaryAction={{ label: "Join Now", href: "/signin" }}
    secondaryAction={{ label: "Explore", href: "#features" }}
  />
);

export const MessagingCard = () => (
  <ThreeDCardDemo
    title="Private Messaging"
    description="Secure, encrypted messaging to connect privately with other verified community members"
    features={["End-to-end encryption", "Private conversations", "Verified users only", "Safe communication"]}
    primaryAction={{ label: "Start Chat", href: "/signin" }}
    secondaryAction={{ label: "Privacy", href: "#support" }}
  />
);
