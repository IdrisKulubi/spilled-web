"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import type { CTASectionProps } from "@/lib/types";

export function CTASection({ content, className }: CTASectionProps) {
  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${className || ''}`} style={{ backgroundColor: '#FFF8F9' }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: '#D96BA0' }}
          >
            <Shield className="h-10 w-10" style={{ color: '#FFFFFF' }} />
          </div>
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: '#3B3B3B' }}
          >
            {content.title}
          </h2>
          <p 
            className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8"
            style={{ color: '#3B3B3B' }}
          >
            {content.description}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6 rounded-2xl font-semibold transition-all duration-200 hover:scale-98 shadow-lg flex items-center gap-2"
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
            <a href={content.primaryButton.href} className="flex items-center gap-2">
              {content.primaryButton.text}
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
          
          {content.secondaryButton && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-2xl font-semibold transition-all duration-200 hover:scale-98 shadow-lg"
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
              <a href={content.secondaryButton.href}>
                {content.secondaryButton.text}
              </a>
            </Button>
          )}
        </div>
        
        <div className="mt-12">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
            <div className="flex items-center">
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: '#76C893' }}
              ></div>
              <span style={{ color: '#3B3B3B' }}>Free to Join</span>
            </div>
            <div className="flex items-center">
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: '#76C893' }}
              ></div>
              <span style={{ color: '#3B3B3B' }}>Women-Only</span>
            </div>
            <div className="flex items-center">
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: '#76C893' }}
              ></div>
              <span style={{ color: '#3B3B3B' }}>100% Anonymous</span>
            </div>
            <div className="flex items-center">
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: '#76C893' }}
              ></div>
              <span style={{ color: '#3B3B3B' }}>Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}