"use client";

import { Button } from "@/components/ui/button";
import type { HeroSectionProps } from "@/lib/types";

export function HeroSection({ content, className }: HeroSectionProps) {
  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${className || ''}`} style={{ backgroundColor: '#FFF8F9' }}>
      <div className="max-w-4xl mx-auto text-center">
        <h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          style={{ color: '#3B3B3B' }}
        >
          {content.title}
        </h1>
        <p 
          className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
          style={{ color: '#3B3B3B' }}
        >
          {content.subtitle}
        </p>
        <Button
          asChild
          size="lg"
          className="text-lg px-8 py-6 rounded-2xl font-semibold transition-all duration-200 hover:scale-98 shadow-lg"
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
          <a href={content.ctaHref}>
            {content.ctaText}
          </a>
        </Button>
      </div>
    </section>
  );
}