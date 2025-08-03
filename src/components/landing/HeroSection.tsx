"use client";

import { Button } from "@/components/ui/button";
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
        <Button
          asChild
          size="lg"
          className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-2xl font-semibold transition-all duration-200 hover:scale-98 shadow-lg min-h-[48px] min-w-[120px] touch-manipulation focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          style={{ 
            backgroundColor: '#D96BA0',
            color: '#FFFFFF',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#C55A8F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#D96BA0';
          }}
        >
          <a 
            href={content.ctaHref} 
            className=" w-full h-full flex items-center justify-center"
            aria-label={`${content.ctaText} - Navigate to get started with Spilled`}
          >
            {content.ctaText}
          </a>
        </Button>
      </div>
    </section>
  );
}