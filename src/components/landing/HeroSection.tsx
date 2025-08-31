"use client";

import type { HeroSectionProps } from "@/lib/types";

import Link from "next/link";

export function HeroSection({ content, className }: HeroSectionProps) {
  return (
    <section 
      className={`relative w-full ${className || ''} -mt-16 md:-mt-20`}
      aria-labelledby="hero-heading"
      role="banner"
    >
      {/* Hero section with background image and overlay content */}
      <div 
        className="relative w-full min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero/hero.png')",
        }}
      >
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 lg:bg-black/20" />
        
        {/* Hero content overlay */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          
          {/* Content positioned over the background image */}
          <div className="flex flex-col items-center text-center space-y-6 lg:space-y-8">
            
            {/* Main heading - visible on all devices */}
            <h1 
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white drop-shadow-2xl"
            >
              {content.title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-white/95 max-w-4xl leading-relaxed drop-shadow-xl">
              {content.subtitle}
            </p>
            
            {/* CTA Buttons */}
            <Link href={"/signin"}>
              <div className="pt-12 flex flex-col sm:flex-row gap-4 items-center">
                <button className="bg-transparent text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors shadow-none focus:outline-none focus:ring-2 focus:ring-white/20">
                  Get Started
              </button>
            </div>
             </Link>
            
            {/* Trust indicators - mobile friendly */}
            <div className="pt-8 flex flex-wrap justify-center gap-6 text-white/90">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                <span className="text-sm font-medium">100% Women-Only</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <span className="text-sm font-medium">ID Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-400 rounded-full" />
                <span className="text-sm font-medium">Encrypted</span>
              </div>
            </div>
            
          </div>
          
        </div>
        
      </div>
    </section>
  );
}
