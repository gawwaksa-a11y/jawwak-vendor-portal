'use client';

import { CalendarDays, Eye, Star, Wallet } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useVendor, useVendorStats } from '@/hooks/use-vendor';

export function StatsCards() {
  const { data: stats, isLoading } = useVendorStats();
  const { data: vendor } = useVendor();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  // بعض القيم تقديرية (لا يوفّر الخادم تجزئة زمنية بعد).
  const cards = [
    {
      icon: Eye,
      label: 'المشاهدات',
      value: (stats?.views ?? 0).toString(),
      sub: 'إجمالي جلسات المزاج',
      color: 'text-sky',
    },
    {
      icon: CalendarDays,
      label: 'الحجوزات',
      value: (stats?.bookings ?? 0).toString(),
      sub: `مُستخدمة: ${stats?.used ?? 0}`,
      color: 'text-sand-dark',
    },
    {
      icon: Star,
      label: 'متوسط التقييم',
      value: `${vendor?.avgRating ?? 0}/5`,
      sub: `من ${vendor?.ratingCount ?? 0} تقييم`,
      color: 'text-amber-500',
    },
    {
      icon: Wallet,
      label: 'معدّل التحويل',
      value: `${Math.round((stats?.conversionRate ?? 0) * 100)}%`,
      sub: 'حجوزات ÷ مشاهدات',
      color: 'text-emerald-500',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label}>
            <CardContent className="flex items-start justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="mt-1 text-2xl font-extrabold">{c.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
              </div>
              <Icon className={`h-8 w-8 ${c.color}`} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
