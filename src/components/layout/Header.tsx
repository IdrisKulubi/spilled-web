"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigation, brand } from "@/lib/constants";
import type { HeaderProps } from "@/lib/types";
import Image from "next/image";

export function Header({ className }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
        className || ""
      }`}
    >
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 min-w-0 flex-shrink-0 focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 rounded-md"
          aria-label={`${brand.name} - Go to homepage`}
        >
          <div 
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md overflow-hidden"
            aria-hidden="true"
          >
            <Image 
              src={brand.logo.src} 
              alt={brand.logo.alt} 
              width={32} 
              height={32}
              className="h-full w-full object-contain"
              priority
              sizes="(max-width: 640px) 28px, 32px"
            />
          </div>
          
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex" role="navigation" aria-label="Main navigation">
          <NavigationMenuList>
            {navigation.main.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 lg:px-6"
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 touch-manipulation">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <SheetHeader>
              <SheetTitle className="text-left">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md overflow-hidden">
                    <Image 
                      src={brand.logo.src} 
                      alt={brand.logo.alt} 
                      width={32} 
                      height={32}
                      className="h-full w-full object-contain"
                      sizes="32px"
                    />
                  </div>
                  <span className="font-bold text-xl">{brand.name}</span>
                </Link>
              </SheetTitle>
              <SheetDescription className="text-left">
                {brand.tagline}
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col space-y-3 mt-6" role="navigation" aria-label="Mobile navigation">
              {navigation.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center py-3 px-2 text-base font-medium transition-colors hover:text-primary rounded-lg hover:bg-accent touch-manipulation min-h-[44px] focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
