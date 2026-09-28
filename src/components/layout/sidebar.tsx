'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CalendarDays,
  Crown,
  Gift,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  Store,
  Wallet,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/analytics', label: 'التحليلات', icon: BarChart3 },
  { href: '/bookings', label: 'الحجوزات', icon: CalendarDays },
  { href: '/reviews', label: 'التقييمات', icon: Star },
  { href: '/profile', label: 'بيانات المتجر', icon: Store },
  { href: '/offers', label: 'العروض', icon: Gift },
  { href: '/finance', label: 'التقرير المالي', icon: Wallet },
  { href: '/admin', label: 'لوحة المؤسّس', icon: Crown },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="flex h-full flex-col gap-1">
      <div className="mb-4 flex items-center gap-2 px-2">
        <span className="text-2xl">🧭</span>
        <span className="text-xl font-extrabold text-sand-dark">جوّك</span>
        <span className="text-xs text-muted-foreground">للأعمال</span>
      </div>

      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary/15 text-sand-dark'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}

      <div className="mt-auto border-t pt-2">
        <button
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
        >
          <LogOut className="h-5 w-5" />
          تسجيل الخروج
        </button>
      </div>
    </nav>
  );
}

/// القائمة الجانبية الثابتة (ديسكتوب).
export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-l bg-card p-4 md:block">
      <SidebarNav />
    </aside>
  );
}
