import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Button,
  Link,
  Heading,
  Hr,
  Img,
} from '@react-email/components';

const DEFAULT_APP_STORE_URL =
  'https://apps.apple.com/ke/app/strathspace/id6757879443';
const DEFAULT_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.strathspace.android';

/** Official badge assets (absolute URLs) for email clients */
const APP_STORE_BADGE_IMG =
  'https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83';
const GOOGLE_PLAY_BADGE_IMG =
  'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png';

interface OnboardingEmailProps {
  recipientEmail?: string;
  recipientName?: string;
  previewText?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}

export const OnboardingEmail: React.FC<OnboardingEmailProps> = ({
  recipientEmail = '',
  recipientName = '',
  previewText = 'No more endless chatting. Real dates only.',
  appStoreUrl: appStoreUrlProp,
  playStoreUrl: playStoreUrlProp,
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://strathspace.com';
  const appStoreUrl =
    appStoreUrlProp ??
    process.env.APP_STORE_URL ??
    process.env.NEXT_PUBLIC_APP_STORE_URL ??
    DEFAULT_APP_STORE_URL;
  const playStoreUrl =
    playStoreUrlProp ??
    process.env.PLAY_STORE_URL ??
    process.env.NEXT_PUBLIC_PLAY_STORE_URL ??
    DEFAULT_PLAY_STORE_URL;

  const firstName = (() => {
    if (recipientName) {
      const name = recipientName.trim().split(' ')[0];
      if (name) return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    const local = recipientEmail ? decodeURIComponent(recipientEmail) : '';
    const firstPart = local ? local.split('@')[0].split(/[._\-+]/)[0] : '';

    return firstPart
      ? firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase()
      : 'there';
  })();

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="64"
              height="64"
              alt="StrathSpace"
              style={logo}
            />
          </Section>

          <Section style={contentContainer}>
            <Heading style={h1}>👀 StrathSpace just got real.</Heading>

            <Text style={paragraph}>Hey {firstName},</Text>

            <Text style={paragraph}>
              You signed up for <strong>StrathSpace</strong> earlier — and we’ve made some big changes.
            </Text>

            <Text style={paragraph}>
              Most dating apps feel the same: endless chatting, unserious matches, and conversations that never become real dates.
            </Text>

            <Text style={paragraph}>
              So we rebuilt the flow around one thing: <strong>real intention.</strong>
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightText}>🔥 How StrathSpace works now</Text>

              <ul style={benefitsList}>
                <li>Curated matches instead of endless swiping</li>
                <li>A quick vibe-check before meeting</li>
                <li>If both people say yes, StrathSpace helps arrange the real date</li>
                <li>Only serious people move forward</li>
              </ul>
            </Section>

            <Text style={paragraph}>
              No more “we should meet” that never happens.
              <br />
              No more wasting time.
            </Text>

            <Text style={paragraph}>
              And to keep things intentional, there’s now a small <strong>Date Confirmation Fee</strong> of <strong>KES 500</strong> only when both people are ready to meet.
            </Text>

            <Text style={paragraph}>
              If someone doesn’t confirm, the match expires so both people can move on.
            </Text>

           

            <Section style={storeSection}>
              <Text style={storeHeading}>Download the app</Text>
              <Text style={storeSubtext}>
                Use StrathSpace on your phone — tap your store below.
              </Text>
              <Row style={storeRow}>
                <Column align="center" style={storeColumn}>
                  <Link href={appStoreUrl} style={storeBadgeLink}>
                    <Img
                      src={APP_STORE_BADGE_IMG}
                      width={135}
                      height={40}
                      alt="Download on the App Store"
                      style={storeBadgeImg}
                    />
                  </Link>
                </Column>
                <Column align="center" style={storeColumn}>
                  <Link href={playStoreUrl} style={storeBadgeLink}>
                    <Img
                      src={GOOGLE_PLAY_BADGE_IMG}
                      width={155}
                      height={60}
                      alt="Get it on Google Play"
                      style={storeBadgeImg}
                    />
                  </Link>
                </Column>
              </Row>
            </Section>

            <Text style={paragraph}>
              <strong>Why this matters:</strong>
            </Text>

            <Section style={featuresList}>
              <Text style={featureItem}>
                💯 <strong>More serious matches:</strong> People who confirm are actually interested.
              </Text>

              <Text style={featureItem}>
                ⏳ <strong>Less time wasted:</strong> Matches expire if people don’t act.
              </Text>

              <Text style={featureItem}>
                ☕ <strong>Real dates:</strong> The goal is not endless chatting — it’s meeting.
              </Text>

              <Text style={featureItem}>
                🔐 <strong>Better experience:</strong> StrathSpace keeps the flow intentional and respectful.
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={footerText}>
              The people coming back now are more intentional.
              <br />
              This is not the same StrathSpace you tried before.
            </Text>

            <Text style={signature}>
              See you inside,
              <br />
              <strong>The StrathSpace Team</strong>
            </Text>

            <Hr style={hr} />

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

            <Text style={footer}>© 2026 StrathSpace. Built for real connections.</Text>

            <Text style={unsubscribe}>
              You’re receiving this because you signed up on StrathSpace.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#FFF7F4',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 16px 48px',
  maxWidth: '720px',
  width: '100%',
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
  borderRadius: '16px',
  padding: '32px 36px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
};

const h1 = {
  color: '#241515',
  fontSize: '26px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 24px',
  lineHeight: '1.35',
};

const paragraph = {
  color: '#4B3A35',
  fontSize: '16px',
  lineHeight: '1.65',
  margin: '16px 0',
};

const highlightBox = {
  backgroundColor: '#FFF1EC',
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 0',
  border: '1px solid #FFD6C8',
};

const highlightText = {
  color: '#E85D3F',
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 10px',
};

const benefitsList = {
  color: '#4B3A35',
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
  backgroundColor: '#E85D3F',
  borderRadius: '999px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  boxShadow: '0 6px 14px rgba(232, 93, 63, 0.28)',
};

const storeSection = {
  margin: '28px 0',
  padding: '24px 16px',
  backgroundColor: '#FFFBF9',
  borderRadius: '12px',
  border: '1px solid #FFE4DB',
};

const storeHeading = {
  color: '#241515',
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 6px',
  lineHeight: '1.3',
};

const storeSubtext = {
  color: '#6B5A55',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '0 0 16px',
  lineHeight: '1.5',
};

const storeRow = {
  margin: '0',
};

const storeColumn = {
  width: '50%',
  verticalAlign: 'middle' as const,
  padding: '6px',
};

const storeBadgeLink = {
  display: 'inline-block',
  textDecoration: 'none',
};

const storeBadgeImg = {
  display: 'block',
  margin: '0 auto',
  border: '0',
  outline: 'none',
};

const featuresList = {
  margin: '20px 0',
};

const featureItem = {
  color: '#4B3A35',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '12px 0',
};

const hr = {
  borderColor: '#EFE1DC',
  margin: '24px 0',
};

const footerText = {
  color: '#6B5A55',
  fontSize: '15px',
  textAlign: 'center' as const,
  margin: '20px 0',
  fontStyle: 'italic',
  lineHeight: '1.6',
};

const signature = {
  color: '#4B3A35',
  fontSize: '15px',
  textAlign: 'center' as const,
  margin: '16px 0',
  lineHeight: '1.6',
};

const footer = {
  color: '#9A8983',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '8px 0',
};

const link = {
  color: '#E85D3F',
  textDecoration: 'none',
};

const unsubscribe = {
  color: '#B8AAA5',
  fontSize: '11px',
  textAlign: 'center' as const,
  margin: '16px 0 0',
  fontStyle: 'italic',
};

export default OnboardingEmail;