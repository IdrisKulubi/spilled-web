import Link from "next/link";
import { navigation, brand } from "@/lib/constants";
import type { FooterProps } from "@/lib/types";

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t bg-background ${className || ""}`}>
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                S
              </div>
              <span className="font-bold text-xl">{brand.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {brand.description}
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <nav className="flex flex-col space-y-2">
              {navigation.footer.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Support</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/contact"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact Us
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                About Spilled
              </Link>
            </nav>
          </div>

          {/* Safety Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Safety</h3>
            <p className="text-sm text-muted-foreground">
              Women-only platform with verified IDs and encrypted messaging for your safety.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {brand.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for women&apos;s safety
          </p>
        </div>
      </div>
    </footer>
  );
}