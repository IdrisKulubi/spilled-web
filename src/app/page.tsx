import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HeroSection, FeaturesSection, SafetySection, SupportSection, CTASection } from "@/components/landing";
import { siteContent, metaData } from "@/lib/constants";
import { auth } from "@/lib/auth";

export default async function Home() {
  // Check if user is signed in
  const session  = await auth.api.getSession({ headers: await headers() });
  
  // If signed in, redirect to the authenticated home
  if (session?.user) {
    redirect("/home");
  }
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: metaData.title,
    description: metaData.description,
    url: metaData.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${metaData.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Spilled',
      url: metaData.url,
      logo: {
        '@type': 'ImageObject',
        url: `${metaData.url}/opengraph-image`,
        width: 1200,
        height: 630,
      },
      sameAs: [
        'https://twitter.com/spilledapp',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-123-4567',
        contactType: 'customer service',
        email: 'support@spilled.app',
        availableLanguage: 'English'
      }
    },
    mainEntity: {
      '@type': 'WebApplication',
      name: metaData.title,
      description: metaData.description,
      applicationCategory: 'SafetyApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      permissions: 'https://spilled.app/privacy',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      featureList: [
        'Anonymous sharing of experiences',
        'Verified user identities',
        'Encrypted messaging',
        'Background checks',
        'Community support',
        'Women-only platform'
      ],
      screenshot: `${metaData.url}/opengraph-image`,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: metaData.url
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection content={siteContent.hero} />
        
        {/* Features Section */}
        <div id="features">
          <FeaturesSection content={siteContent.features} />
        </div>
        
        {/* Safety Section */}
        <div id="safety">
          <SafetySection content={siteContent.safety} />
        </div>
        
        {/* Support Section */}
        <div id="support">
          <SupportSection content={siteContent.support} />
        </div>
        
        {/* Call-to-Action Section */}
        <div id="cta">
          <CTASection content={siteContent.cta} />
        </div>
      </div>
    </>
  );
}