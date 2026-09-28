'use client';

import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { useVendor } from '@/hooks/use-vendor';
import { MobileNav } from './mobile-nav';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { data: vendor } = useVendor();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-card/80 px-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <MobileNav />
        <span className="font-bold md:hidden">🧭 جوّك</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -left-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            3
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="تبديل الوضع الليلي"
        >
          <Sun className="h-5 w-5 dark:hidden" />
          <Moon className="hidden h-5 w-5 dark:block" />
        </Button>

        <div className="flex items-center gap-2 pr-1">
          <div className="text-left leading-tight">
            <p className="text-sm font-semibold">
              {vendor?.businessNameAr ?? 'متجري'}
            </p>
            <p className="text-xs text-muted-foreground">
              {vendor?.verified ? 'موثّق ✓' : 'قيد المراجعة'}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sand-dark">
            {(vendor?.businessNameAr ?? 'ج').charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
