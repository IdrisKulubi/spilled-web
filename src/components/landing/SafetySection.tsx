import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SafetySectionProps } from "@/lib/types";

export function SafetySection({ content, className }: SafetySectionProps) {
  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${className || ''}`} style={{ backgroundColor: '#FFF8F9' }}>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {content.features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <Card 
                key={index}
                className="relative rounded-2xl shadow-lg transition-all duration-200 hover:scale-[0.98] border-0 group"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 20px rgba(217, 107, 160, 0.1)'
                }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ backgroundColor: 'rgba(253, 236, 239, 0.3)' }}
                />
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ 
                        backgroundColor: '#D96BA0',
                        color: '#FFFFFF'
                      }}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge 
                      variant="secondary"
                      className="text-xs font-medium rounded-lg px-3 py-1"
                      style={{
                        backgroundColor: '#76C893',
                        color: '#FFFFFF'
                      }}
                    >
                      Secure
                    </Badge>
                  </div>
                  <CardTitle 
                    className="text-xl font-semibold"
                    style={{ color: '#3B3B3B' }}
                  >
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
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
        
        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div 
            className="inline-flex flex-wrap justify-center items-center gap-6 px-8 py-4 rounded-2xl"
            style={{ backgroundColor: '#FDECEF' }}
          >
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: '#76C893' }}
              ></div>
              <span 
                className="text-sm font-medium"
                style={{ color: '#3B3B3B' }}
              >
                100% Women-Only Platform
              </span>
            </div>
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: '#76C893' }}
              ></div>
              <span 
                className="text-sm font-medium"
                style={{ color: '#3B3B3B' }}
              >
                End-to-End Encrypted
              </span>
            </div>
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: '#76C893' }}
              ></div>
              <span 
                className="text-sm font-medium"
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