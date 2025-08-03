"use client";

import { AppStoreButton } from "@/components/ui/app-store-button";
import { Shield } from "lucide-react";
import type { CTASectionProps } from "@/lib/types";

export function CTASection({ content, className }: CTASectionProps) {
  return (
    <section 
      className={`py-16 sm:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 lg:px-8 ${className || ''}`} 
      style={{ backgroundColor: '#FFF8F9' }}
      aria-labelledby="cta-heading"
      role="region"
    >
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-6 sm:mb-8">
          <div 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
            style={{ backgroundColor: '#D96BA0' }}
            aria-hidden="true"
          >
            <Shield className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: '#FFFFFF' }} />
          </div>
          <h2 
            id="cta-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2"
            style={{ color: '#3B3B3B' }}
          >
            {content.title}
          </h2>
          <p 
            className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4"
            style={{ color: '#3B3B3B' }}
            aria-describedby="cta-heading"
          >
            {content.description}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 max-w-md sm:max-w-none mx-auto mb-8 sm:mb-12">
          {content.appStoreButtons.map((button, index) => (
            <AppStoreButton 
              key={index} 
              button={button} 
              className="w-full sm:w-auto"
            />
          ))}
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm px-4">
          <div className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: '#76C893' }}
            ></div>
            <span style={{ color: '#3B3B3B' }} className="whitespace-nowrap">Free to Join</span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: '#76C893' }}
            ></div>
            <span style={{ color: '#3B3B3B' }} className="whitespace-nowrap">Women-Only</span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: '#76C893' }}
            ></div>
            <span style={{ color: '#3B3B3B' }} className="whitespace-nowrap">100% Anonymous</span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: '#76C893' }}
            ></div>
            <span style={{ color: '#3B3B3B' }} className="whitespace-nowrap">Secure & Private</span>
          </div>
        </div>
      </div>
    </section>
  );
}