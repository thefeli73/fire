'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Calculator, BookOpen, Flame, Percent, Anchor, Sparkles } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="bg-background/90 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="mr-4 hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="hover:bg-primary/10 flex items-center gap-2 rounded-full px-2 py-1 transition-colors"
          >
            <Image
              src="/investingfire_logo_no-bg.svg"
              alt="InvestingFIRE"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="hidden font-bold sm:inline-block">InvestingFIRE</span>
          </Link>
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Link
              href="/"
              className="text-foreground/70 hover:bg-primary/10 hover:text-foreground flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors"
            >
              <Calculator className="h-4 w-4" />
              Calculator
            </Link>
            <Link
              href="/learn"
              className="text-foreground/70 hover:bg-primary/10 hover:text-foreground flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Learn
            </Link>
            <Link
              href="/learn/what-is-fire"
              className="text-foreground/70 hover:bg-primary/10 hover:text-foreground flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors"
            >
              <Flame className="h-4 w-4" />
              What is FIRE?
            </Link>
          </nav>
        </div>

        {/* Mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 focus-visible:bg-primary/20 mr-2 rounded-full border px-2 text-base focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="from-background via-primary/25 to-secondary/25 w-[86vw] max-w-sm border-r bg-gradient-to-b px-0 pb-10 shadow-xl"
          >
            <SheetHeader className="px-8 py-4">
              <SheetTitle>
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/investingfire_logo_no-bg.svg"
                      alt="InvestingFIRE"
                      width={24}
                      height={24}
                    />
                    <span className="font-bold">InvestingFIRE</span>
                  </Link>
                </div>
              </SheetTitle>
              <SheetDescription className="text-muted-foreground text-xs">
                Built to make FIRE math simple and transparent for everyone.
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-2 px-8">
              <Link
                href="/"
                className="text-foreground/80 hover:bg-primary/10 hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 transition-colors"
              >
                <Calculator className="h-4 w-4" />
                Calculator
              </Link>
              <Link
                href="/learn"
                className="text-foreground/80 hover:bg-primary/10 hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Learn
              </Link>
              <Link
                href="/learn/what-is-fire"
                className="text-foreground/80 hover:bg-primary/10 hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 transition-colors"
              >
                <Flame className="h-4 w-4" />
                What is FIRE?
              </Link>
              <Link
                href="/learn/safe-withdrawal-rate-4-percent-rule"
                className="text-foreground/80 hover:bg-primary/10 hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
              >
                <Percent className="h-4 w-4" />
                The 4% Rule
              </Link>
              <Link
                href="/learn/coast-fire-vs-lean-fire"
                className="text-foreground/80 hover:bg-primary/10 hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
              >
                <Anchor className="h-4 w-4" />
                Coast vs. Lean FIRE
              </Link>
            </nav>
            <div className="px-8 pt-6">
              <Button className="w-full justify-center gap-2" variant="secondary">
                <Sparkles className="h-4 w-4" />
                Launch the calculator
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile brand in center */}
        <div className="flex flex-1 items-center justify-center md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/investingfire_logo_no-bg.svg" alt="InvestingFIRE" width={24} height={24} />
            <span className="text-sm font-bold">InvestingFIRE</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 md:flex-none">
          {/* Future: Theme Toggle, GitHub Link etc */}
        </div>
      </div>
    </header>
  );
}
