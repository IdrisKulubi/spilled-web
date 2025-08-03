import { LucideIcon } from "lucide-react";

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface Navigation {
  main: NavItem[];
  footer: NavItem[];
}

// Feature types
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  status: 'available' | 'coming-soon';
}

// Safety feature types
export interface SafetyFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

// App store button types
export interface AppStoreButton {
  text: string;
  href: string;
  icon: 'apple' | 'google';
}

// Content section types
export interface HeroContent {
  title: string;
  subtitle: string;
  appStoreButtons: AppStoreButton[];
}

export interface FeaturesContent {
  title: string;
  subtitle: string;
  features: Feature[];
}

export interface SafetyContent {
  title: string;
  subtitle: string;
  features: SafetyFeature[];
}

export interface SupportContent {
  title: string;
  description: string;
}

export interface CTAContent {
  title: string;
  description: string;
  appStoreButtons: AppStoreButton[];
}

export interface SiteContent {
  hero: HeroContent;
  features: FeaturesContent;
  safety: SafetyContent;
  support: SupportContent;
  cta: CTAContent;
}

// Component prop types
export interface HeaderProps {
  className?: string;
}

export interface FooterProps {
  className?: string;
}

export interface HeroSectionProps {
  content: HeroContent;
  className?: string;
}

export interface FeaturesSectionProps {
  content: FeaturesContent;
  className?: string;
}

export interface SafetySectionProps {
  content: SafetyContent;
  className?: string;
}

export interface SupportSectionProps {
  content: SupportContent;
  className?: string;
}

export interface CTASectionProps {
  content: CTAContent;
  className?: string;
}

// Brand and meta types
export interface BrandInfo {
  name: string;
  tagline: string;
  description: string;
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export interface MetaData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  url: string;
  image: string;
}

// Color scheme type
export interface ColorPalette {
  50: string;
  100: string;
  500: string;
  600: string;
  700: string;
}

export interface ColorScheme {
  primary: ColorPalette;
  secondary: ColorPalette;
  success: ColorPalette;
  warning: ColorPalette;
  danger: ColorPalette;
}

// Responsive breakpoints type
export interface Breakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}