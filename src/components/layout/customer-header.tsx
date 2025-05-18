"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut } from "lucide-react";

const publicNavigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Book Appointment", href: "/book" },
];

const privateNavigation = [
  { name: "My Appointments", href: "/my-appointments" },
];

export function CustomerHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Beauty & Wellness Center
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
            {session && privateNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    My Profile
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="gap-2"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth/client/signin">
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  Sign In / Sign Up
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 