import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Spilled",
  description: "Get in touch with the Spilled team. We're here to help with questions, support, and feedback about our women-only safety platform.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}