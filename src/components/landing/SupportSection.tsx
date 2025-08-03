import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Users } from "lucide-react";
import type { SupportSectionProps } from "@/lib/types";

export function SupportSection({ content, className }: SupportSectionProps) {
  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${className || ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: '#3B3B3B' }}
          >
            {content.title}
          </h2>
          <p 
            className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: '#3B3B3B' }}
          >
            {content.description}
          </p>
        </div>
        
        <Card 
          className="rounded-2xl shadow-lg border-0 p-8"
          style={{ 
            backgroundColor: '#FDECEF',
            boxShadow: '0 4px 20px rgba(217, 107, 160, 0.1)'
          }}
        >
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#D96BA0' }}
                >
                  <MessageCircle className="h-8 w-8" style={{ color: '#FFFFFF' }} />
                </div>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: '#3B3B3B' }}
                >
                  In-App Support
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: '#3B3B3B' }}
                >
                  Get help directly through the app whenever you need it. Our support team is here for you.
                </p>
              </div>
              
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#76C893' }}
                >
                  <Users className="h-8 w-8" style={{ color: '#FFFFFF' }} />
                </div>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: '#3B3B3B' }}
                >
                  Community Support
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: '#3B3B3B' }}
                >
                  Connect with other women who understand your experiences and are here to help.
                </p>
              </div>
              
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#D96BA0' }}
                >
                  <Heart className="h-8 w-8" style={{ color: '#FFFFFF' }} />
                </div>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: '#3B3B3B' }}
                >
                  Compassionate Care
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: '#3B3B3B' }}
                >
                  We understand difficult situations and provide empathetic support when you need it most.
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p 
                className="text-base font-medium"
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