"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
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
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 max-w-md sm:max-w-none mx-auto">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-2xl font-semibold transition-all duration-200 hover:scale-98 shadow-lg min-h-[48px] touch-manipulation focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
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
              href={content.primaryButton.href} 
              className="flex items-center justify-center gap-2 w-full h-full"
              aria-label={`${content.primaryButton.text} - Start using Spilled now`}
            >
              {content.primaryButton.text}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </a>
          </Button>
          
          {content.secondaryButton && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-2xl font-semibold transition-all duration-200 hover:scale-98 shadow-lg min-h-[48px] touch-manipulation focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              style={{ 
                borderColor: '#D96BA0',
                color: '#D96BA0',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FDECEF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <a 
                href={content.secondaryButton.href} 
                className="block w-full h-full flex items-center justify-center"
                aria-label={`${content.secondaryButton.text} - Learn more about Spilled`}
              >
                {content.secondaryButton.text}
              </a>
            </Button>
          )}
        </div>
        
        <div className="mt-8 sm:mt-12">
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
      </div>
    </section>
  );
}