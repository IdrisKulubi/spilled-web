"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {  Shield, Users, Sparkles } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const session = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session.data?.user) {
      router.replace("/home");
    }
  }, [session.data?.user, router]);

  if (session.data?.user) return null;

  const signInGoogle = async () => {
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/home",
      });
    } catch (e) {
      console.error("Google sign-in failed", e);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md relative">
        {/* Logo & Branding */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Image
              src="/spilled-icon.png"
              alt="Spilled Logo"
              width={90}
              height={90}
              className="drop-shadow-xl animate-bounce"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Spilled
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Share stories, stay safe ✨
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Real girls. Real experiences.
          </p>
        </div>

        {/* Sign In Card */}
        <div className="backdrop-blur-xl bg-white/80 border border-pink-100 shadow-2xl rounded-2xl p-8 transition hover:shadow-pink-200">
          <Button
            onClick={signInGoogle}
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium rounded-xl shadow-lg hover:opacity-90 transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/60 border-t-white" />
              ) : (
                <FaGoogle className="h-5 w-5" />
              )}
              <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
            </div>
          </Button>

          {/* Features */}
          <div className="mt-8 space-y-4 text-gray-600">
            {[
              { icon: Shield, text: "Safe & secure platform" },
              { icon: Users, text: "Verified community members" },
              { icon: Sparkles, text: "Real stories, real experiences" },
            ].map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-pink-50/50 hover:bg-pink-100/70 transition"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center">
                  <Icon className="h-4 w-4 text-pink-500" />
                </div>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:underline font-medium"
          >
            Terms of Service
          </a>{" "}
          &{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:underline font-medium"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
