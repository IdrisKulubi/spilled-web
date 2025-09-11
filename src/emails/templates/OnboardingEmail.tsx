import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Link,
  Heading,
  Hr,
  Img,
} from '@react-email/components';

interface OnboardingEmailProps {
  recipientEmail?: string;
  recipientName?: string;
  previewText?: string;
}

export const OnboardingEmail: React.FC<OnboardingEmailProps> = ({
  recipientEmail = '',
  recipientName = '',
  previewText = "The tea is hot ☕… and it's only for you 💕",
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://spilledforwomen.com';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoContainer}>
            <Img
              src={`${baseUrl}/spilled-icon.png`}
              width="60"
              height="60"
              alt="Spilled"
              style={logo}
            />
          </Section>

          {/* Content */}
          <Section style={contentContainer}>
            <Heading style={h1}>💌 The Tea is Hot, Bestie…</Heading>
            
            <Text style={paragraph}>
              Psst… hey {(() => {
                // First try to use the provided name
                if (recipientName) {
                  const firstName = recipientName.trim().split(' ')[0];
                  if (firstName) {
                    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
                  }
                }
                // Fallback to email parsing
                const local = recipientEmail ? decodeURIComponent(recipientEmail) : '';
                const firstPart = local ? local.split('@')[0].split(/[._\-+]/)[0] : '';
                return firstPart
                  ? firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase()
                  : 'Bestie';
              })()} 👀{' '}
              We noticed something. While StrathSpace was fun, you deserve a space that's <strong>truly yours</strong>.
            </Text>

            <Text style={paragraph}>
              That’s why we built <strong>Spilled</strong>  a safe, private, invite-only circle where  women can share dating stories, swap advice, and always look out for each other 💕
            </Text>

            {/* Highlight Invite Box */}
            <Section style={highlightBox}>
              <Text style={highlightText}>
                🎉 You’re one of the <strong>very first</strong> to be invited.
              </Text>
              <Text style={subHighlightText}>
                As an OG Spiller, you’ll unlock:
              </Text>
              <ul style={benefitsList}>
                <li>✨ Exclusive <strong>"OG Spiller"</strong> badge</li>
                <li>🔮 Early access to new features</li>
                <li>💬 Priority in polls & community decisions</li>
                <li>🎁 Special surprises (only for insiders)</li>
              </ul>
            </Section>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Button
                style={button}
                href={`${baseUrl}/signin?ref=invite&email=${encodeURIComponent(recipientEmail)}`}
              >
                Join Spilled Now 💌
              </Button>
            </Section>

            {/* Features */}
            <Text style={paragraph}>
              <strong>What makes Spilled different?</strong>
            </Text>

            <Section style={featuresList}>
              <Text style={featureItem}>
                🔍 <strong>Check the vibes:</strong> Search someone before a date, see what other girls say
              </Text>
              <Text style={featureItem}>
                🛡️ <strong>Real sisters only:</strong> Every member is ID-verified for safety
              </Text>
              <Text style={featureItem}>
                💭 <strong>Your story, your way:</strong> Post with your name… or stay anonymous
              </Text>
              <Text style={featureItem}>
                🚩 <strong>Flags don’t lie:</strong> Spot red flags, celebrate green ones, keep each other safe
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={footerText}>
              The tea is hot, the circle is waiting, and your sisters are already inside. ☕✨
            </Text>

            <Text style={signature}>
              With love,<br />
              <strong>The Spilled Team</strong> 💕
            </Text>

            <Hr style={hr} />

            {/* Footer */}
            <Text style={footer}>
              <Link href={`${baseUrl}/privacy`} style={link}>
                Privacy Policy
              </Link>
              {' • '}
              <Link href={`${baseUrl}/terms`} style={link}>
                Terms of Service
              </Link>
              {' • '}
              <Link href={`${baseUrl}/contact`} style={link}>
                Contact Us
              </Link>
            </Text>

            <Text style={footer}>
              © 2025 Spilled. Made with 💕 for women.
            </Text>

            <Text style={unsubscribe}>
              You’re receiving this one-time invite because you signed up on strathspace.  
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#FFF8F9',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const logo = {
  margin: '0 auto',
};

const contentContainer = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '32px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 24px',
  lineHeight: '1.4',
};

const paragraph = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const highlightBox = {
  backgroundColor: '#FFF0F5',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  border: '2px solid #FFE4E1',
};

const highlightText = {
  color: '#D96BA0',
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 8px',
};

const subHighlightText = {
  color: '#666',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '8px 0',
};

const benefitsList = {
  color: '#525252',
  fontSize: '14px',
  lineHeight: '1.8',
  paddingLeft: '20px',
  margin: '12px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#D96BA0',
  borderRadius: '24px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  boxShadow: '0 4px 6px rgba(217, 107, 160, 0.3)',
};

const featuresList = {
  margin: '20px 0',
};

const featureItem = {
  color: '#525252',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '12px 0',
  paddingLeft: '24px',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '24px 0',
};

const footerText = {
  color: '#666',
  fontSize: '15px',
  textAlign: 'center' as const,
  margin: '20px 0',
  fontStyle: 'italic',
};

const signature = {
  color: '#525252',
  fontSize: '15px',
  textAlign: 'center' as const,
  margin: '16px 0',
  lineHeight: '1.6',
};

const footer = {
  color: '#999',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '8px 0',
};

const link = {
  color: '#D96BA0',
  textDecoration: 'none',
};

const unsubscribe = {
  color: '#b3b3b3',
  fontSize: '11px',
  textAlign: 'center' as const,
  margin: '16px 0 0',
  fontStyle: 'italic',
};

export default OnboardingEmail;
