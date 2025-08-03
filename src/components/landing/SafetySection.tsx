import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SafetySectionProps } from "@/lib/types";

export function SafetySection({ content, className }: SafetySectionProps) {
  return (
    <section 
      className={`py-16 sm:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 lg:px-8 ${className || ''}`} 
      style={{ backgroundColor: '#FFF8F9' }}
      aria-labelledby="safety-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 
            id="safety-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2"
            style={{ color: '#3B3B3B' }}
          >
            {content.title}
          </h2>
          <p 
            className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4"
            style={{ color: '#3B3B3B' }}
            aria-describedby="safety-heading"
          >
            {content.subtitle}
          </p>
        </div>
        
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
          role="list"
          aria-label="Safety features"
        >
          {content.features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <Card 
                key={index}
                className="relative rounded-2xl shadow-lg transition-all duration-200 hover:scale-[0.98] border-0 group focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 20px rgba(217, 107, 160, 0.1)'
                }}
                role="listitem"
                tabIndex={0}
                aria-labelledby={`safety-${index}-title`}
                aria-describedby={`safety-${index}-description`}
              >
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ backgroundColor: 'rgba(253, 236, 239, 0.3)' }}
                  aria-hidden="true"
                />
                <CardHeader className="pb-3 sm:pb-4 relative z-10">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div 
                      className="p-2 sm:p-3 rounded-lg"
                      style={{ 
                        backgroundColor: '#D96BA0',
                        color: '#FFFFFF'
                      }}
                      aria-hidden="true"
                    >
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <Badge 
                      variant="secondary"
                      className="text-xs font-medium rounded-lg px-2 sm:px-3 py-1 shrink-0"
                      style={{
                        backgroundColor: '#76C893',
                        color: '#FFFFFF'
                      }}
                      aria-label="Security status: Secure"
                    >
                      Secure
                    </Badge>
                  </div>
                  <CardTitle 
                    id={`safety-${index}-title`}
                    className="text-lg sm:text-xl font-semibold leading-tight"
                    style={{ color: '#3B3B3B' }}
                  >
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <CardDescription 
                    id={`safety-${index}-description`}
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: '#3B3B3B' }}
                  >
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-12 sm:mt-16 text-center">
          <div 
            className="inline-flex flex-wrap justify-center items-center gap-3 sm:gap-6 px-4 sm:px-8 py-3 sm:py-4 rounded-2xl mx-4"
            style={{ backgroundColor: '#FDECEF' }}
          >
            <div className="flex items-center">
              <div 
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2"
                style={{ backgroundColor: '#76C893' }}
              ></div>
              <span 
                className="text-xs sm:text-sm font-medium whitespace-nowrap"
                style={{ color: '#3B3B3B' }}
              >
                100% Women-Only Platform
              </span>
            </div>
            <div className="flex items-center">
              <div 
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2"
                style={{ backgroundColor: '#76C893' }}
              ></div>
              <span 
                className="text-xs sm:text-sm font-medium whitespace-nowrap"
                style={{ color: '#3B3B3B' }}
              >
                End-to-End Encrypted
              </span>
            </div>
            <div className="flex items-center">
              <div 
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2"
                style={{ backgroundColor: '#76C893' }}
              ></div>
              <span 
                className="text-xs sm:text-sm font-medium whitespace-nowrap"
                style={{ color: '#3B3B3B' }}
              >
                ID Verified Users Only
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}