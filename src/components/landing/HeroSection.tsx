"use client";

import { AppStoreButton } from "@/components/ui/app-store-button";
import type { HeroSectionProps } from "@/lib/types";

export function HeroSection({ content, className }: HeroSectionProps) {
  return (
    <section 
      className={`py-16 sm:py-20 lg:py-28 xl:py-32 px-4 sm:px-6 lg:px-8 ${className || ''}`} 
      style={{ backgroundColor: '#FFF8F9' }}
      aria-labelledby="hero-heading"
      role="banner"
    >
      <div className="max-w-5xl mx-auto text-center">
        <h1 
          id="hero-heading"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight px-2"
          style={{ color: '#3B3B3B' }}
        >
          {content.title}
        </h1>
        <p 
          className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 sm:mb-8 lg:mb-10 max-w-4xl mx-auto leading-relaxed px-4"
          style={{ color: '#3B3B3B' }}
          aria-describedby="hero-heading"
        >
          {content.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 max-w-md sm:max-w-none mx-auto">
          {content.appStoreButtons.map((button, index) => (
            <AppStoreButton 
              key={index} 
              button={button} 
              className="w-full sm:w-auto"
            />
          ))}
        </div>
      </div>
    </section>
  );
}