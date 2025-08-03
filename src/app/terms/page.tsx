import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Spilled",
  description: "Read the terms of service for Spilled, the women-only safety platform for sharing experiences and making informed decisions.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F9]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-[#3B3B3B] mb-6">Terms of Service</h1>
          <p className="text-lg text-[#3B3B3B] mb-8 opacity-80">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Agreement to Terms</h2>
              <p className="text-[#3B3B3B] mb-4">
                By accessing and using Spilled (&quot;the Platform&quot;), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-[#3B3B3B]">
                These Terms of Service (&quot;Terms&quot;) govern your use of our women-only safety platform operated by Spilled.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Eligibility and Account Requirements</h2>
              
              <h3 className="text-xl font-medium text-[#3B3B3B] mb-3">Women-Only Policy</h3>
              <p className="text-[#3B3B3B] mb-4">
                Spilled is exclusively for women. By creating an account, you confirm that you identify as a woman. 
                Violation of this policy will result in immediate account termination.
              </p>

              <h3 className="text-xl font-medium text-[#3B3B3B] mb-3">Identity Verification</h3>
              <p className="text-[#3B3B3B] mb-4">
                All users must complete identity verification to ensure platform safety and authenticity. 
                You agree to provide accurate identification documents when requested.
              </p>

              <h3 className="text-xl font-medium text-[#3B3B3B] mb-3">Age Requirement</h3>
              <p className="text-[#3B3B3B] mb-4">
                You must be at least 18 years old to use Spilled. By using the platform, you confirm that you meet this age requirement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Acceptable Use Policy</h2>
              
              <h3 className="text-xl font-medium text-[#3B3B3B] mb-3">Permitted Uses</h3>
              <p className="text-[#3B3B3B] mb-4">You may use Spilled to:</p>
              <ul className="list-disc pl-6 text-[#3B3B3B] mb-4 space-y-2">
                <li>Share truthful experiences about individuals for safety purposes</li>
                <li>Search for information about people in your life</li>
                <li>Connect with other women for support and advice</li>
                <li>Access safety resources and information</li>
              </ul>

              <h3 className="text-xl font-medium text-[#3B3B3B] mb-3">Prohibited Activities</h3>
              <p className="text-[#3B3B3B] mb-4">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-[#3B3B3B] mb-4 space-y-2">
                <li>Post false, misleading, or defamatory information</li>
                <li>Share content that violates privacy or confidentiality</li>
                <li>Harass, threaten, or intimidate other users</li>
                <li>Attempt to circumvent identity verification</li>
                <li>Use the platform for commercial purposes without permission</li>
                <li>Share explicit or inappropriate content</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Content and Information Sharing</h2>
              
              <h3 className="text-xl font-medium text-[#3B3B3B] mb-3">Truthfulness Requirement</h3>
              <p className="text-[#3B3B3B] mb-4">
                All information shared on Spilled must be truthful and based on your personal experience. 
                False or misleading information undermines platform safety and may result in account termination.
              </p>

              <h3 className="text-xl font-medium text-[#3B3B3B] mb-3">Content Ownership</h3>
              <p className="text-[#3B3B3B] mb-4">
                You retain ownership of content you post, but grant Spilled a license to use, display, and 
                distribute your content as necessary to operate the platform.
              </p>

              <h3 className="text-xl font-medium text-[#3B3B3B] mb-3">Content Moderation</h3>
              <p className="text-[#3B3B3B] mb-4">
                Spilled reserves the right to review, moderate, and remove content that violates these terms 
                or community guidelines. We may also suspend or terminate accounts for policy violations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Privacy and Data Protection</h2>
              <p className="text-[#3B3B3B] mb-4">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
                your information. By using Spilled, you agree to our privacy practices as outlined in our Privacy Policy.
              </p>
              <p className="text-[#3B3B3B] mb-4">
                We implement strong security measures including end-to-end encryption for messaging and secure 
                data storage to protect your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Platform Availability and Changes</h2>
              <p className="text-[#3B3B3B] mb-4">
                We strive to keep Spilled available 24/7, but cannot guarantee uninterrupted service. 
                We may temporarily suspend the platform for maintenance, updates, or other operational reasons.
              </p>
              <p className="text-[#3B3B3B] mb-4">
                We reserve the right to modify, update, or discontinue features of the platform at any time. 
                We will provide reasonable notice of significant changes when possible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Disclaimers and Limitations</h2>
              
              <h3 className="text-xl font-medium text-[#3B3B3B] mb-3">Information Accuracy</h3>
              <p className="text-[#3B3B3B] mb-4">
                While we encourage truthful sharing, Spilled cannot verify the accuracy of all user-generated content. 
                Use information on the platform as one factor in your decision-making, not as the sole basis for important decisions.
              </p>

              <h3 className="text-xl font-medium text-[#3B3B3B] mb-3">Platform Limitations</h3>
              <p className="text-[#3B3B3B] mb-4">
                Spilled is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the platform 
                will meet all your needs or be error-free.
              </p>

              <h3 className="text-xl font-medium text-[#3B3B3B] mb-3">Liability Limitation</h3>
              <p className="text-[#3B3B3B] mb-4">
                To the maximum extent permitted by law, Spilled shall not be liable for any indirect, incidental, 
                special, or consequential damages arising from your use of the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Account Termination</h2>
              <p className="text-[#3B3B3B] mb-4">
                You may delete your account at any time through your account settings. Upon deletion, 
                your personal information will be removed according to our Privacy Policy.
              </p>
              <p className="text-[#3B3B3B] mb-4">
                We may suspend or terminate your account if you violate these Terms of Service, 
                our community guidelines, or engage in behavior that threatens platform safety.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Governing Law and Disputes</h2>
              <p className="text-[#3B3B3B] mb-4">
                These Terms are governed by the laws of Kenya. Any disputes arising from your use of 
                Spilled will be resolved through binding arbitration in Nairobi, Kenya.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Contact Information</h2>
              <p className="text-[#3B3B3B] mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-[#FDECEF] p-4 rounded-lg">
                <p className="text-[#3B3B3B] font-medium">Email: legal@spilled.app</p>
                <p className="text-[#3B3B3B] font-medium">Subject: Terms of Service Inquiry</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">Changes to Terms</h2>
              <p className="text-[#3B3B3B] mb-4">
                We may update these Terms of Service from time to time. We will notify users of significant 
                changes via email or platform notification. Continued use of Spilled after changes constitutes 
                acceptance of the new terms.
              </p>
              <p className="text-[#3B3B3B]">
                We encourage you to review these Terms periodically to stay informed of any updates.
              </p>
            </section>

            <div className="bg-[#D96BA0] text-white p-6 rounded-xl mt-8">
              <h3 className="text-lg font-semibold mb-2">Emergency Situations</h3>
              <p className="opacity-90">
                If you are in immediate danger, contact local emergency services immediately. 
                Spilled is a support platform but cannot replace professional emergency services or law enforcement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}