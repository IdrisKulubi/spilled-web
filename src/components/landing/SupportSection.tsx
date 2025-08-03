import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Users } from "lucide-react";
import type { SupportSectionProps } from "@/lib/types";

export function SupportSection({ content, className }: SupportSectionProps) {
  return (
    <section 
      className={`py-16 sm:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 lg:px-8 ${className || ''}`}
      aria-labelledby="support-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 
            id="support-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2"
            style={{ color: '#3B3B3B' }}
          >
            {content.title}
          </h2>
          <p 
            className="text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto px-4"
            style={{ color: '#3B3B3B' }}
            aria-describedby="support-heading"
          >
            {content.description}
          </p>
        </div>
        
        <Card 
          className="rounded-2xl shadow-lg border-0 p-4 sm:p-6 lg:p-8"
          style={{ 
            backgroundColor: '#FDECEF',
            boxShadow: '0 4px 20px rgba(217, 107, 160, 0.1)'
          }}
        >
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  style={{ backgroundColor: '#D96BA0' }}
                >
                  <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: '#FFFFFF' }} />
                </div>
                <h3 
                  className="text-base sm:text-lg font-semibold mb-2"
                  style={{ color: '#3B3B3B' }}
                >
                  In-App Support
                </h3>
                <p 
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: '#3B3B3B' }}
                >
                  Get help directly through the app whenever you need it. Our support team is here for you.
                </p>
              </div>
              
              <div className="text-center">
                <div 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  style={{ backgroundColor: '#76C893' }}
                >
                  <Users className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: '#FFFFFF' }} />
                </div>
                <h3 
                  className="text-base sm:text-lg font-semibold mb-2"
                  style={{ color: '#3B3B3B' }}
                >
                  Community Support
                </h3>
                <p 
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: '#3B3B3B' }}
                >
                  Connect with other women who understand your experiences and are here to help.
                </p>
              </div>
              
              <div className="text-center">
                <div 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  style={{ backgroundColor: '#D96BA0' }}
                >
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: '#FFFFFF' }} />
                </div>
                <h3 
                  className="text-base sm:text-lg font-semibold mb-2"
                  style={{ color: '#3B3B3B' }}
                >
                  Compassionate Care
                </h3>
                <p 
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: '#3B3B3B' }}
                >
                  We understand difficult situations and provide empathetic support when you need it most.
                </p>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 text-center">
              <p 
                className="text-sm sm:text-base font-medium"
                style={{ color: '#3B3B3B' }}
              >
                Available 24/7 • Confidential • Free
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}