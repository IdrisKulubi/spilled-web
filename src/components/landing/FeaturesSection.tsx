import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeaturesSectionProps } from "@/lib/types";

export function FeaturesSection({ content, className }: FeaturesSectionProps) {
  return (
    <section 
      className={`py-16 sm:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 lg:px-8 ${className || ''}`}
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 
            id="features-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2"
            style={{ color: '#3B3B3B' }}
          >
            {content.title}
          </h2>
          <p 
            className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4"
            style={{ color: '#3B3B3B' }}
            aria-describedby="features-heading"
          >
            {content.subtitle}
          </p>
        </div>
        
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
          role="list"
          aria-label="Platform features"
        >
          {content.features.map((feature) => {
            const IconComponent = feature.icon;
            const isAvailable = feature.status === 'available';
            
            return (
              <Card 
                key={feature.id}
                className="relative rounded-2xl shadow-lg transition-all duration-200 hover:scale-98 border-0 focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2"
                style={{ 
                  backgroundColor: '#FDECEF',
                  boxShadow: '0 4px 20px rgba(217, 107, 160, 0.1)'
                }}
                role="listitem"
                tabIndex={0}
                aria-labelledby={`feature-${feature.id}-title`}
                aria-describedby={`feature-${feature.id}-description`}
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div 
                      className="p-2 sm:p-3 rounded-lg"
                      style={{ 
                        backgroundColor: isAvailable ? '#76C893' : '#D96BA0',
                        color: '#FFFFFF'
                      }}
                      aria-hidden="true"
                    >
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <Badge 
                      variant="secondary"
                      className="text-xs font-medium rounded-lg px-2 py-1 shrink-0"
                      style={{
                        backgroundColor: isAvailable ? '#76C893' : '#F25F5C',
                        color: '#FFFFFF'
                      }}
                      aria-label={`Feature status: ${isAvailable ? 'Available now' : 'Coming soon'}`}
                    >
                      {isAvailable ? 'Available' : 'Coming Soon'}
                    </Badge>
                  </div>
                  <CardTitle 
                    id={`feature-${feature.id}-title`}
                    className="text-lg sm:text-xl font-semibold leading-tight"
                    style={{ color: '#3B3B3B' }}
                  >
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription 
                    id={`feature-${feature.id}-description`}
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
      </div>
    </section>
  );
}