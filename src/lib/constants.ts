import type { 
  Navigation, 
  SiteContent, 
  BrandInfo, 
  MetaData, 
  ColorScheme, 
  Breakpoints 
} from "./types";

// Navigation data
export const navigation: Navigation = {
  main: [
    { label: "Privacy", href: "/privacy" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Terms", href: "/terms" },
  ],
  footer: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

// Site content data
export const siteContent: SiteContent = {
  hero: {
    title: "Spilled - Your Safety Network",
    subtitle: "The women-only platform where you can safely share experiences and make informed decisions about the people in your life.",
    appStoreButtons: [
      {
        text: "Download on the App Store",
        href: "https://apps.apple.com/app/spilled/id123456789", // Replace with actual App Store link
        icon: "apple",
      },
      {
        text: "Get it on Google Play",
        href: "https://play.google.com/store/apps/details?id=com.spilled.app", // Replace with actual Play Store link
        icon: "google",
      },
    ],
  },
  features: {
    title: "Discover What Others Have Experienced",
    subtitle: "Get the insights you need to make informed decisions about the people in your life.",
    features: [
      {
        id: "green-flags",
        title: "Green Flag Men",
        description: "Find positive experiences and recommendations from other women about trustworthy individuals.",
        iconName: "CheckCircle",
        status: "available",
      },
      {
        id: "search",
        title: "Search Anyone",
        description: "Look up specific individuals to see what experiences other women have shared.",
        iconName: "Search",
        status: "available",
      },
      {
        id: "red-flags",
        title: "Red Flag Warnings",
        description: "Access important warnings and negative experiences to help you stay safe.",
        iconName: "AlertTriangle",
        status: "available",
      },
      {
        id: "background-checks",
        title: "Background Checks",
        description: "Comprehensive background verification coming soon to enhance your safety.",
        iconName: "FileText",
        status: "coming-soon",
      },
      {
        id: "reverse-image",
        title: "Reverse Image Search",
        description: "Verify profile photos and identify fake accounts with advanced image matching.",
        iconName: "Eye",
        status: "coming-soon",
      },
      {
        id: "criminal-records",
        title: "Criminal Record Search",
        description: "Access public criminal records to make fully informed decisions.",
        iconName: "Shield",
        status: "coming-soon",
      },
    ],
  },
  safety: {
    title: "The Safest Place to Share Your Truth",
    subtitle: "Your privacy and safety are our top priorities. Share experiences with complete confidence.",
    features: [
      {
        title: "Verified User IDs",
        description: "All users must verify their identity to ensure authentic experiences and prevent fake accounts.",
        iconName: "UserCheck",
      },
      {
        title: "Anonymous Posting",
        description: "Share your experiences anonymously while still contributing to the community's safety.",
        iconName: "Eye",
      },
      {
        title: "Women-Only Policy",
        description: "Strictly enforced women-only platform ensures a safe space for honest sharing.",
        iconName: "Users",
      },
      {
        title: "Encrypted Messaging",
        description: "All communications are end-to-end encrypted to protect your privacy and conversations.",
        iconName: "MessageSquare",
      },
      {
        title: "Secure Data Protection",
        description: "Your personal information is protected with industry-leading security measures.",
        iconName: "Lock",
      },
    ],
  },
  support: {
    title: "Women Supporting Women",
    description: "Get support from our community and dedicated team whenever you need it. We're here to help you navigate difficult situations and make informed decisions.",
  },
  cta: {
    title: "Ready to Take Control of Your Safety?",
    description: "Join thousands of women who are already using Spilled to make informed decisions and stay safe.",
    appStoreButtons: [
      {
        text: "Download on the App Store",
        href: "https://apps.apple.com/app/spilled/id123456789", // Replace with actual App Store link
        icon: "apple",
      },
      {
        text: "Get it on Google Play",
        href: "https://play.google.com/store/apps/details?id=com.spilled.app", // Replace with actual Play Store link
        icon: "google",
      },
    ],
  },
};

// Brand constants
export const brand: BrandInfo = {
  name: "Spilled",
  tagline: "Your Safety Network",
  description: "The women-only platform for sharing experiences and making informed decisions about people in your life.",
  logo: {
    src: "/spilled-icon.png",
    alt: "Spilled Logo",
    width: 40,
    height: 40,
  },
};

// Meta data constants
export const metaData: MetaData = {
  title: "Spilled - Your Safety Network",
  description: "The women-only platform where you can safely share experiences and make informed decisions about the people in your life.",
  keywords: "women safety, background checks, dating safety, personal safety, women community, anonymous sharing, verified users, encrypted messaging, red flags, green flags, women supporting women",
  author: "Spilled",
  url: "https://spilled.app",
  image: "/opengraph-image",
};

// Color scheme constants (for reference)
export const colors: ColorScheme = {
  primary: {
    50: "#fdf2f8",
    100: "#fce7f3",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
  },
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
  },
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },
};

// Responsive breakpoints (for reference)
export const breakpoints: Breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};