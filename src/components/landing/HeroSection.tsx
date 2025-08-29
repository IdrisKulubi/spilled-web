"use client";

import type { HeroSectionProps } from "@/lib/types";

import Image from 'next/image';

export function HeroSection({ content, className }: HeroSectionProps) {
  return (
    <section 
      className={`relative w-full ${className || ''}`}
      aria-labelledby="hero-heading"
      role="banner"
    >
      <Image
        src="/hero/hero.png"
        alt="Spilled hero artwork"
        width={1920}
        height={1080}
        priority
        sizes="100vw"
        className="w-full h-auto block select-none"
      />
    </section>
  );
}
