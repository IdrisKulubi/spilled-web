import type { Metadata } from "next";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist. Return to Spilled's homepage to continue exploring our women-only safety platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF8F9] flex items-center justify-center">
      <div className="text-center px-4 max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 bg-[#D96BA0] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-white">404</span>
          </div>
          <h1 className="text-4xl font-bold text-[#3B3B3B] mb-4">Page Not Found</h1>
          <p className="text-lg text-[#3B3B3B] opacity-80 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full bg-[#D96BA0] hover:bg-[#D96BA0]/90 text-white">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full border-[#D96BA0] text-[#D96BA0] hover:bg-[#D96BA0] hover:text-white">
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-[#FDECEF] rounded-lg">
          <p className="text-sm text-[#3B3B3B] opacity-80">
            Need help? <Link href="/contact" className="text-[#D96BA0] hover:underline font-medium">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}