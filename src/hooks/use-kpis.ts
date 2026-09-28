'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

export interface FounderKpis {
  vendors: number;
  usersRegistered: number;
  moodSessions: number;
  bookingsCompleted: number;
  bookingsTotal: number;
  conversionRate: number;
  avgRating: number;
  activeUsers: number;
  generatedAt: string;
}

/// مؤشّرات المؤسّس من /admin/kpis.
export function useKpis() {
  return useQuery({
    queryKey: ['admin-kpis'],
    queryFn: () => apiClient.get<FounderKpis>('/admin/kpis'),
    refetchInterval: 30_000,
  });
}

export interface KpiPoint {
  date: string;
  bookings: number;
  sessions: number;
}

/// سلسلة زمنية يومية للحجوزات وجلسات المزاج.
export function useKpisTimeseries(days = 14) {
  return useQuery({
    queryKey: ['admin-kpis-timeseries', days],
    queryFn: () =>
      apiClient.get<KpiPoint[]>(`/admin/kpis/timeseries?days=${days}`),
    refetchInterval: 30_000,
  });
}
