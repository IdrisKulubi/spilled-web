import Link from "next/link";
import { navigation, brand } from "@/lib/constants";
import type { FooterProps } from "@/lib/types";

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t bg-background ${className || ""}`} role="contentinfo" aria-label="Site footer">
      <div className="container py-6 sm:py-8 md:py-12 px-4 sm:px-6">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 md:col-span-1">
            <Link 
              href="/" 
              className="flex items-center space-x-2 focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 rounded-md"
              aria-label={`${brand.name} - Go to homepage`}
            >
              <div 
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm sm:text-base"
                aria-hidden="true"
              >
                S
              </div>
              <span className="font-bold text-lg sm:text-xl">{brand.name}</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs leading-relaxed">
              {brand.description}
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold">Legal</h3>
            <nav className="flex flex-col space-y-1 sm:space-y-2" aria-label="Legal pages">
              {navigation.footer.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground py-1 touch-manipulation focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support Section */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold">Support</h3>
            <nav className="flex flex-col space-y-1 sm:space-y-2" aria-label="Support pages">
              <Link
                href="/contact"
                className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground py-1 touch-manipulation focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
              >
                Contact Us
              </Link>
              <Link
                href="/about"
                className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground py-1 touch-manipulation focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
              >
                About Spilled
              </Link>
            </nav>
          </div>

          {/* Safety Section */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 md:col-span-1">
            <h3 className="text-xs sm:text-sm font-semibold">Safety</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Women-only platform with verified IDs and encrypted messaging for your safety.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6 lg:pt-8 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © {currentYear} {brand.name}. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
            Made with ❤️ for women&apos;s safety
          </p>
        </div>
      </div>
    </footer>
  );
}