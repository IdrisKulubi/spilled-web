import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeaturesSectionProps } from "@/lib/types";

export function FeaturesSection({ content, className }: FeaturesSectionProps) {
  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${className || ''}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: '#3B3B3B' }}
          >
            {content.title}
          </h2>
          <p 
            className="text-lg sm:text-xl max-w-3xl mx-auto"
            style={{ color: '#3B3B3B' }}
          >
            {content.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.features.map((feature) => {
            const IconComponent = feature.icon;
            const isAvailable = feature.status === 'available';
            
            return (
              <Card 
                key={feature.id}
                className="relative rounded-2xl shadow-lg transition-all duration-200 hover:scale-98 border-0"
                style={{ 
                  backgroundColor: '#FDECEF',
                  boxShadow: '0 4px 20px rgba(217, 107, 160, 0.1)'
                }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ 
                        backgroundColor: isAvailable ? '#76C893' : '#D96BA0',
                        color: '#FFFFFF'
                      }}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge 
                      variant="secondary"
                      className="text-xs font-medium rounded-lg px-2 py-1"
                      style={{
                        backgroundColor: isAvailable ? '#76C893' : '#F25F5C',
                        color: '#FFFFFF'
                      }}
                    >
                      {isAvailable ? 'Available' : 'Coming Soon'}
                    </Badge>
                  </div>
                  <CardTitle 
                    className="text-xl font-semibold"
                    style={{ color: '#3B3B3B' }}
                  >
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription 
                    className="text-base leading-relaxed"
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