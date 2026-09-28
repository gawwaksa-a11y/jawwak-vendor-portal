'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { getVendorId } from '@/lib/auth';
import type { Booking, Paginated } from '@/types';
import { useFinance, useVendorStats } from './use-vendor';

/// سلاسل التحليلات — كلها من الـ Backend:
/// الإيرادات الأسبوعية من /finance، وعدد الحجوزات اليومية محسوب من /bookings.
export function useAnalytics() {
  const id = typeof window !== 'undefined' ? getVendorId() : null;
  const stats = useVendorStats();
  const finance = useFinance();

  const bookings = useQuery({
    queryKey: ['analytics-bookings', id],
    enabled: !!id,
    queryFn: () =>
      apiClient.get<Paginated<Booking>>(`/vendors/${id}/bookings?limit=200`),
  });

  const weeklyBookings = useMemo(() => {
    const items = bookings.data?.items ?? [];
    const days: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const count = items.filter((b) => {
        const t = new Date(b.createdAt).getTime();
        return t >= d.getTime() && t < next.getTime();
      }).length;
      days.push({
        day: d.toLocaleDateString('ar-SA', { weekday: 'long' }),
        count,
      });
    }
    return days;
  }, [bookings.data]);

  return {
    stats: stats.data,
    statsLoading: stats.isLoading,
    weeklyBookings,
    weeklyRevenue: finance.data?.weekly ?? [],
    seriesLoading: finance.isLoading || bookings.isLoading,
  };
}
