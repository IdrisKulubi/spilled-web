import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { metaData } from "@/lib/constants";
import { NavBar } from "@/components/layout/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(metaData.url),
  title: {
    default: metaData.title,
    template: `%s | ${metaData.title}`,
  },
  description: metaData.description,
  keywords: metaData.keywords,
  authors: [{ name: metaData.author }],
  creator: metaData.author,
  publisher: metaData.author,
  applicationName: "Spilled",
  referrer: "origin-when-cross-origin",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: metaData.title,
    description: metaData.description,
    url: metaData.url,
    siteName: metaData.title,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${metaData.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: metaData.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: metaData.title,
    description: metaData.description,
    creator: "@spilledapp",
    site: "@spilledapp",
    images: [
      {
        url: `${metaData.url}/twitter-image`,
        width: 1200,
        height: 630,
        alt: metaData.title,
      },
    ],
  },
  verification: {
    google: "google-site-verification-code", // Replace with actual verification code
    yandex: "yandex-verification-code", // Replace with actual verification code
    yahoo: "yahoo-site-verification-code", // Replace with actual verification code
  },
  alternates: {
    canonical: metaData.url,
  },
  category: "Safety",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  colorScheme: "light",
  themeColor: "#D96BA0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          Skip to main content
        </a>
        <div className="flex flex-col min-h-screen pt-20 sm:pt-24">
          <NavBar/>
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
