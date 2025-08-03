import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Spilled team. We're here to help with questions, support, and feedback about our women's safety platform.",
  keywords: "contact spilled, customer support, help, feedback, women safety support, technical support, community support",
  openGraph: {
    title: "Contact Spilled - Get Support",
    description: "Get in touch with the Spilled team. We're here to help with questions, support, and feedback about our women's safety platform.",
    url: "https://spilled.app/contact",
    type: "website",
    images: [
      {
        url: "https://spilled.app/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Contact Spilled - Get Support",
      },
    ],
  },
  twitter: {
    title: "Contact Spilled - Get Support",
    description: "Get in touch with the Spilled team. We're here to help with questions, support, and feedback.",
    images: [
      {
        url: "https://spilled.app/twitter-image",
        width: 1200,
        height: 630,
        alt: "Contact Spilled - Get Support",
      },
    ],
  },
  alternates: {
    canonical: "https://spilled.app/contact",
  },
};

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Spilled',
    description: 'Get in touch with the Spilled team for support, questions, and feedback about our women-only safety platform.',
    url: 'https://spilled.app/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'Spilled',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+1-555-123-4567',
          contactType: 'customer service',
          email: 'support@spilled.app',
          availableLanguage: 'English',
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
            timeZone: 'EST'
          }
        }
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Safety Street',
        addressLocality: 'Safety City',
        addressRegion: 'SC',
        postalCode: '12345',
        addressCountry: 'US'
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactForm />
    </>
  );
}