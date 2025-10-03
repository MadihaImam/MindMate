'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { LifeBuoy } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Logo />
        </div>
        <nav className="hidden items-center space-x-4 md:flex">
          <Link href="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Pricing
          </Link>
           <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Dashboard
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
           <Link href="/dashboard" className="hidden items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:flex">
            <LifeBuoy className="mr-2 h-4 w-4" />
            Help & Feedback
          </Link>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
