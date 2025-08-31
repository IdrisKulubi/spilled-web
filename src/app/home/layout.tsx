"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, Compass, Search, SquarePen, User } from "lucide-react";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if we're on the verify page
  const isVerifyPage = pathname === '/home/verify';
  
  // If on verify page, render children without sidebar
  if (isVerifyPage) {
    return <>{children}</>;
  }
  
  // Otherwise, render with sidebar
  return (
    <SidebarProvider defaultOpen>
      {/* Left Sidebar */}
      <Sidebar variant="inset" collapsible="icon">
        {/* Spacer to avoid overlapping with the fixed global header */}
        <div className="h-20 sm:h-24" />
        <SidebarHeader>
          <div className="px-2">
            
            <div className="text-sm font-semibold">Home</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Home">
                    <Link href="/home">
                      <Home />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Explore">
                    <Link href="/home#explore">
                      <Compass />
                      <span>Explore</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Search">
                    <Link href="/home#search">
                      <Search />
                      <span>Search</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Share a story">
                    <Link href="/home/add-post">
                      <SquarePen />
                      <span>Share a story</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Profile">
                    <Link href="/home/profile">
                      <User />
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button asChild className="w-full">
            <Link href="/home/add-post">New story</Link>
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* Main content area */}
      <SidebarInset>
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 md:py-4">
            <SidebarTrigger />
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Dashboard</div>
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
