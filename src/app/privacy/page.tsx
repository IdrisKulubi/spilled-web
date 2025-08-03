import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Spilled protects your privacy and handles your personal information on our women-only safety platform. Comprehensive privacy protection for all users.",
  keywords: "privacy policy, data protection, user privacy, women safety privacy, personal information, encrypted messaging, anonymous sharing, GDPR compliance",
  openGraph: {
    title: "Privacy Policy - Spilled",
    description: "Learn how Spilled protects your privacy and handles your personal information on our women-only safety platform.",
    url: "https://spilled.app/privacy",
    type: "website",
    images: [
      {
        url: "https://spilled.app/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Privacy Policy - Spilled",
      },
    ],
  },
  twitter: {
    title: "Privacy Policy - Spilled",
    description: "Learn how Spilled protects your privacy and handles your personal information.",
    images: [
      {
        url: "https://spilled.app/twitter-image",
        width: 1200,
        height: 630,
        alt: "Privacy Policy - Spilled",
      },
    ],
  },
  alternates: {
    canonical: "https://spilled.app/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F9]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-[#3B3B3B] mb-6">Privacy Policy</h1>
            <p className="text-lg text-[#3B3B3B] mb-8 opacity-80">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </header>

          <div className="prose prose-lg max-w-none" role="main" aria-labelledby="privacy-policy-heading">
            <section className="mb-8" aria-labelledby="introduction-heading">
              <h2 id="introduction-heading" className="text-2xl font-semibold text-[#3B3B3B] mb-4">Introduction</h2>
              <p className="text-[#3B3B3B] mb-4">
                At Spilled, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                women-only safety platform.
              </p>
              <p className="text-[#3B3B3B]">
                By using Spilled, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-[#3B3B3B] mb-3">Personal Information</h3>
              <p className="text-[#3B3B3B] mb-4">
                We may collect personal information that you voluntarily provide to us, including:
              </p>
              <ul className="list-disc pl-6 text-[#3B3B3B] mb-4 space-y-2">
                <li>Identity verification information (for safety purposes)</li>
                <li>Contact information (email address)</li>
                <li>Profile information you choose to share</li>
                <li>Content you post on the platform</li>
              </ul>

              <h3 className="text-xl font-medium text-[#3B3B3B] mb-3">Usage Information</h3>
              <p className="text-[#3B3B3B] mb-4">
                We automatically collect certain information about your use of our platform, including:
              </p>
              <ul className="list-disc pl-6 text-[#3B3B3B] mb-4 space-y-2">
                <li>Device information and identifiers</li>
                <li>Usage patterns and preferences</li>
                <li>Log data and analytics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">How We Use Your Information</h2>
              <p className="text-[#3B3B3B] mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-[#3B3B3B] mb-4 space-y-2">
                <li>Provide and maintain our safety platform</li>
                <li>Verify user identities for community safety</li>
                <li>Enable anonymous sharing while preventing abuse</li>
                <li>Improve our services and user experience</li>
                <li>Communicate with you about your account and our services</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Information Sharing and Disclosure</h2>
              <p className="text-[#3B3B3B] mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except:
              </p>
              <ul className="list-disc pl-6 text-[#3B3B3B] mb-4 space-y-2">
                <li>When required by law or legal process</li>
                <li>To protect the rights, property, or safety of Spilled, our users, or others</li>
                <li>With your explicit consent</li>
                <li>To trusted service providers who assist in operating our platform (under strict confidentiality agreements)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Data Security</h2>
              <p className="text-[#3B3B3B] mb-4">
                We implement industry-standard security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-[#3B3B3B] mb-4 space-y-2">
                <li>End-to-end encryption for messaging</li>
                <li>Secure data storage and transmission</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication measures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Your Rights and Choices</h2>
              <p className="text-[#3B3B3B] mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-[#3B3B3B] mb-4 space-y-2">
                <li>Access and review your personal information</li>
                <li>Request corrections to your data</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of certain communications</li>
                <li>Request data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Contact Us</h2>
              <p className="text-[#3B3B3B] mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-[#FDECEF] p-4 rounded-lg">
                <p className="text-[#3B3B3B] font-medium">Email: privacy@spilled.app</p>
                <p className="text-[#3B3B3B] font-medium">Subject: Privacy Policy Inquiry</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Changes to This Policy</h2>
              <p className="text-[#3B3B3B]">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to 
                review this Privacy Policy periodically for any changes.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}