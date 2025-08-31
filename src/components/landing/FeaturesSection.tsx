import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { FeaturesSectionProps } from "@/lib/types";
import ThreeDCardDemo, { SafetyCard, CommunityCard, MessagingCard } from "@/components/ui/3d-card-demo";
import { Shield, Users, MessageSquare } from "lucide-react";

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
          
          <div className="mt-6 sm:mt-8">
            <Link href="/signup">
              <Button 
                size="lg"
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                style={{
                  backgroundColor: '#D96BA0',
                  color: '#FFFFFF'
                }}
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Highlight 3D Cards Section */}
        <div className="mb-16 sm:mb-20">
          <h3 className="text-xl sm:text-2xl font-semibold text-center mb-8 sm:mb-12" style={{ color: '#3B3B3B' }}>
            Experience Our Core Features
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4">
            <div className="flex justify-center">
              <ThreeDCardDemo
                title="Verified & Safe"
                description="All users undergo identity verification and background checks to ensure a secure environment"
                imageUrl="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2689&auto=format&fit=crop"
                imageAlt="Safety and verification"
                icon={<Shield className="w-6 h-6 text-pink-600" />}
                primaryAction={{ label: "Get Verified", href: "/signin" }}
                secondaryAction={{ label: "Learn More →", href: "#safety" }}
              />
            </div>
            <div className="flex justify-center">
              <ThreeDCardDemo
                title="Supportive Community"
                description="Connect with women who understand your experiences and are ready to offer support"
                imageUrl="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2832&auto=format&fit=crop"
                imageAlt="Community support"
                icon={<Users className="w-6 h-6 text-pink-600" />}
                primaryAction={{ label: "Join Now", href: "/signin" }}
                secondaryAction={{ label: "Explore →", href: "#features" }}
              />
            </div>
            <div className="flex justify-center">
              <ThreeDCardDemo
                title="Private Messaging"
                description="Secure, encrypted messaging to connect privately with other verified community members"
                imageUrl="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop"
                imageAlt="Private messaging"
                icon={<MessageSquare className="w-6 h-6 text-pink-600" />}
                primaryAction={{ label: "Start Chatting", href: "/signin" }}
                secondaryAction={{ label: "Privacy →", href: "#support" }}
              />
            </div>
          </div>
        </div>
        
        {/* All Features Grid */}
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-center mb-8 sm:mb-12" style={{ color: '#3B3B3B' }}>
            All Platform Features
          </h3>
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
      </div>
    </section>
  );
}