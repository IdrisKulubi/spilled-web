"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, User, LogOut,  Home, ChevronDown, MessageCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { navigation } from "@/lib/constants";

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  // Client-side session via better-auth
  const session = authClient.useSession();
  const user = session.data?.user;
  const loading = session.isPending;

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y === 0) {
        setIsVisible(true);
      } else if (y > lastScrollY && y > 80) {
        setIsVisible(false);
      } else if (y < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/");
    } catch (e) {
      console.error("Sign out failed", e);
    }
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <>
      {/* Spacer to prevent overlap with fixed navbar */}
      <div className="h-12 sm:h-12" />

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full",
          "bg-white/90 backdrop-blur-md border-b border-gray-200/50",
          "transition-transform duration-300 ease-in-out",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="w-full px-0">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Brand - Logo moved to absolute far left */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 absolute left-4">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image
                  src="/spilled-icon.png"
                  alt="Spilled Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden sm:inline font-bold text-lg sm:text-xl text-gray-900">Spilled</span>
            </Link>

            {/* Desktop nav - centered with left margin to avoid logo overlap */}
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center ml-32">
              {navigation.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    "hover:bg-gray-100",
                    pathname === item.href && "bg-gray-100"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 absolute right-4">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-pink-600" />
                      </div>
                      <span className="hidden sm:inline text-sm font-medium">{displayName}</span>
                      <ChevronDown className="w-4 h-4 hidden sm:inline" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/home")}> 
                      <Home className="mr-2 h-4 w-4" /> Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/home/chat")}>
                      <MessageCircle className="mr-2 h-4 w-4" /> Messages
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/home/profile")}>
                      <User className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => router.push("/home/settings")}>
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => router.push("/signin")}>Sign in</Button>
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white" onClick={() => router.push("/signin")}>Get Started</Button>
                </div>
              )}

              {/* Mobile menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>Navigate</SheetDescription>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 mt-6">
                    {navigation.main.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100",
                          pathname === item.href && "bg-gray-100"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t pt-4 mt-4">
                      {user ? (
                        <>
                          <Link href="/home" className="block px-4 py-2 rounded-md hover:bg-gray-100" onClick={() => setIsOpen(false)}>Dashboard</Link>
                          <Link href="/home/chat" className="block px-4 py-2 rounded-md hover:bg-gray-100" onClick={() => setIsOpen(false)}>Messages</Link>
                          <Link href="/home/profile" className="block px-4 py-2 rounded-md hover:bg-gray-100" onClick={() => setIsOpen(false)}>Profile</Link>
                          <button className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50" onClick={() => { handleSignOut(); setIsOpen(false); }}>Sign out</button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" className="w-full" onClick={() => { router.push("/signin"); setIsOpen(false); }}>Sign in</Button>
                          <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white" onClick={() => { router.push("/signin"); setIsOpen(false); }}>Get Started</Button>
                        </>
                      )}
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

