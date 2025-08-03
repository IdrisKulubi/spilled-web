import type { Metadata } from "next";
import { Shield, Users, Heart, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - Spilled",
  description:
    "Learn about Spilled's mission to create a safer world for women through community-driven information sharing and support.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F9]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-[#3B3B3B] mb-6">
            About Spilled
          </h1>
          <p className="text-xl text-[#3B3B3B] mb-12 opacity-80">
            Empowering women through shared experiences and community-driven
            safety.
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">
                Our Mission
              </h2>
              <p className="text-[#3B3B3B] mb-6">
                Spilled was created with a simple yet powerful mission: to
                provide women with a safe, supportive platform where they can
                share experiences and make informed decisions about the people
                in their lives. We believe that when women support each other
                with honest, authentic information, we all become safer.
              </p>
              <p className="text-[#3B3B3B]">
                Our platform serves as a digital sisterhood where experiences
                are shared anonymously, identities are verified for safety, and
                every woman has access to the information she needs to protect
                herself and make empowered choices.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-6">
                Our Values
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#FDECEF] p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-[#D96BA0] mr-3" />
                    <h3 className="text-lg font-semibold text-[#3B3B3B]">
                      Safety First
                    </h3>
                  </div>
                  <p className="text-[#3B3B3B]">
                    Every feature we build prioritizes user safety, from
                    identity verification to encrypted messaging.
                  </p>
                </div>

                <div className="bg-[#FDECEF] p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <Users className="w-6 h-6 text-[#D96BA0] mr-3" />
                    <h3 className="text-lg font-semibold text-[#3B3B3B]">
                      Community Support
                    </h3>
                  </div>
                  <p className="text-[#3B3B3B]">
                    We foster a supportive environment where women can share
                    experiences without judgment.
                  </p>
                </div>

                <div className="bg-[#FDECEF] p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <Heart className="w-6 h-6 text-[#D96BA0] mr-3" />
                    <h3 className="text-lg font-semibold text-[#3B3B3B]">
                      Empowerment
                    </h3>
                  </div>
                  <p className="text-[#3B3B3B]">
                    We believe in empowering women with information to make
                    confident, informed decisions.
                  </p>
                </div>

                <div className="bg-[#FDECEF] p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-[#D96BA0] mr-3" />
                    <h3 className="text-lg font-semibold text-[#3B3B3B]">
                      Authenticity
                    </h3>
                  </div>
                  <p className="text-[#3B3B3B]">
                    We maintain the integrity of our platform through verified
                    users and authentic experiences.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">
                Why Spilled Exists
              </h2>
              <p className="text-[#3B3B3B] mb-4">
                Too often, women find themselves in situations where they wish
                they had known more about someone before getting involved.
                Whether it&apos;s dating, professional relationships, or social
                connections, having access to other women&apos;s experiences can be
                invaluable for making safe choices.
              </p>
              <p className="text-[#3B3B3B] mb-4">
                Traditional background check services are expensive, limited,
                and don&apos;t capture the nuanced experiences that matter most to
                women. Social media and public records only tell part of the
                story. Spilled fills this gap by creating a space where women
                can share real experiences about real people.
              </p>
              <p className="text-[#3B3B3B]">
                We&apos;re not about gossip or rumors – we&apos;re about creating a
                verified, supportive community where women can access and share
                authentic experiences to help each other stay safe and make
                informed decisions.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">
                Our Commitment to Safety
              </h2>
              <p className="text-[#3B3B3B] mb-4">
                Safety isn&apos;t just a feature for us – it&apos;s the foundation of
                everything we do:
              </p>
              <ul className="list-disc pl-6 text-[#3B3B3B] mb-4 space-y-2">
                <li>
                  <strong>Identity Verification:</strong> All users must verify
                  their identity to ensure authentic experiences
                </li>
                <li>
                  <strong>Anonymous Sharing:</strong> Share experiences without
                  revealing your identity
                </li>
                <li>
                  <strong>Women-Only Policy:</strong> Strictly enforced to
                  maintain a safe space
                </li>
                <li>
                  <strong>Encrypted Communications:</strong> All messages are
                  end-to-end encrypted
                </li>
                <li>
                  <strong>Content Moderation:</strong> Active monitoring to
                  prevent abuse and maintain community standards
                </li>
                <li>
                  <strong>Privacy Protection:</strong> Your personal information
                  is never shared or sold
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">
                Looking Forward
              </h2>
              <p className="text-[#3B3B3B] mb-4">
                We&apos;re continuously working to expand our platform with new
                safety features, including comprehensive background checks,
                reverse image search capabilities, and criminal record searches.
                Our goal is to become the most comprehensive safety resource for
                women worldwide.
              </p>
              <p className="text-[#3B3B3B]">
                Every feature we develop is guided by feedback from our
                community and our unwavering commitment to women&apos;s safety and
                empowerment.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4">
                Join Our Mission
              </h2>
              <p className="text-[#3B3B3B] mb-6">
                Whether you&apos;re looking to share your experiences or learn from
                others, you&apos;re contributing to a safer world for all women.
                Together, we can create a community where information empowers,
                experiences protect, and women support women.
              </p>
              <div className="bg-[#D96BA0] text-white p-6 rounded-xl text-center">
                <p className="text-lg font-medium mb-4">
                  Ready to be part of the solution?
                </p>
                <p className="opacity-90">
                  Join thousands of women who are already making their
                  communities safer through Spilled.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
