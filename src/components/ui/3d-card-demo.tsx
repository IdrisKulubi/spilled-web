"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Shield, Users, MessageCircle } from "lucide-react";

export interface ThreeDCardDemoProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
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
  imageUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2688&auto=format&fit=crop",
  imageAlt = "Safe community sharing",
  primaryAction = { label: "Join Community", href: "/signin" },
  secondaryAction = { label: "Learn More →", href: "#features" },
  icon = <Shield className="w-6 h-6 text-pink-600" />
}: ThreeDCardDemoProps) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-pink-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem
          translateZ="50"
          className="flex items-center gap-3 text-xl font-bold text-neutral-600 dark:text-white"
        >
          {icon}
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {description}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <div className="relative h-60 w-full overflow-hidden rounded-xl">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover group-hover/card:shadow-xl transition-all duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <CardItem
            translateZ={20}
            as={secondaryAction.href ? "a" : "button"}
            href={secondaryAction.href}
            onClick={secondaryAction.onClick}
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {secondaryAction.label}
          </CardItem>
          <CardItem
            translateZ={20}
            as={primaryAction.href ? "a" : "button"}
            href={primaryAction.href}
            onClick={primaryAction.onClick}
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-700 text-white text-xs font-bold transition-colors cursor-pointer"
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
    imageUrl="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2689&auto=format&fit=crop"
    imageAlt="Safety and verification"
    icon={<Shield className="w-6 h-6 text-pink-600" />}
    primaryAction={{ label: "Get Verified", href: "/signin" }}
    secondaryAction={{ label: "Learn About Safety →", href: "#safety" }}
  />
);

export const CommunityCard = () => (
  <ThreeDCardDemo
    title="Supportive Community"
    description="Connect with women who understand your experiences and are ready to offer support"
    imageUrl="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2832&auto=format&fit=crop"
    imageAlt="Community support"
    icon={<Users className="w-6 h-6 text-pink-600" />}
    primaryAction={{ label: "Join Now", href: "/signin" }}
    secondaryAction={{ label: "Explore Features →", href: "#features" }}
  />
);

export const MessagingCard = () => (
  <ThreeDCardDemo
    title="Private Messaging"
    description="Secure, encrypted messaging to connect privately with other verified community members"
    imageUrl="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop"
    imageAlt="Private messaging"
    icon={<MessageCircle className="w-6 h-6 text-pink-600" />}
    primaryAction={{ label: "Start Chatting", href: "/signin" }}
    secondaryAction={{ label: "Privacy Policy →", href: "#support" }}
  />
);
