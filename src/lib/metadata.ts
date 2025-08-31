import { metaData } from "@/lib/constants";
import { Metadata } from "next";
import { ensureStartsWith } from "./utils";

const { TWITTER_CREATOR, TWITTER_SITE } = process.env;
const twitterCreator = TWITTER_CREATOR
  ? ensureStartsWith(TWITTER_CREATOR, "@")
  : "@spilledapp";
const twitterSite = TWITTER_SITE
  ? ensureStartsWith(TWITTER_SITE, "https://")
  : "@spilledapp";

export function constructMetadata({
  title = metaData.title,
  description = metaData.description,
  image = "https://res.cloudinary.com/db0i0umxn/image/upload/v1756668377/hero_ff1hil.png",
  icons = "/favicon.ico",
  noIndex = false,
  keywords = metaData.keywords.split(", "),
  author = metaData.author,
  url = metaData.url,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  keywords?: string[];
  author?: string;
  url?: string;
} = {}): Metadata {
  return {
    metadataBase: new URL(url),
    title: {
      default: title,
      template: `%s | ${metaData.title}`,
    },
    description,
    keywords,
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    applicationName: "Spilled",
    referrer: "origin-when-cross-origin",
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: metaData.title,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: twitterCreator,
      site: twitterSite,
      images: [
        {
          url: `${url}/twitter-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    verification: {
      google: "google-site-verification-code", // Replace with actual verification code
      yandex: "yandex-verification-code", // Replace with actual verification code
      yahoo: "yahoo-site-verification-code", // Replace with actual verification code
    },
    alternates: {
      canonical: url,
    },
    category: "Safety",
    icons,
  };
}