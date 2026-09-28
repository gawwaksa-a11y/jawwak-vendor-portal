'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { getVendorId } from '@/lib/auth';
import type { Paginated, Review, Vendor, VendorStats } from '@/types';

/// المتجر النشط الحالي عبر نقطة /vendors/mine (حسب التوكن).
export function useVendor() {
  return useQuery({
    queryKey: ['vendor', 'mine'],
    queryFn: () => apiClient.get<Vendor>('/vendors/mine'),
  });
}

/// إحصائيات المتجر (مشاهدات، حجوزات، معدّل تحويل).
export function useVendorStats() {
  const id = typeof window !== 'undefined' ? getVendorId() : null;
  return useQuery({
    queryKey: ['vendor-stats', id],
    enabled: !!id,
    queryFn: () => apiClient.get<VendorStats>(`/vendors/${id}/stats`),
  });
}

/// تقييمات المتجر النشط.
export function useReviews() {
  const id = typeof window !== 'undefined' ? getVendorId() : null;
  return useQuery({
    queryKey: ['vendor-reviews', id],
    enabled: !!id,
    queryFn: () =>
      apiClient.get<Paginated<Review>>(`/vendors/${id}/reviews?limit=50`),
  });
}

export interface FinanceReport {
  totalBookings: number;
  totalRevenue: number;
  commissionPct: number;
  commission: number;
  net: number;
  weekly: { week: string; revenue: number; commission: number }[];
  payoutStatus: string;
}

/// التقرير المالي للمتجر النشط.
export function useFinance() {
  const id = typeof window !== 'undefined' ? getVendorId() : null;
  return useQuery({
    queryKey: ['vendor-finance', id],
    enabled: !!id,
    queryFn: () => apiClient.get<FinanceReport>(`/vendors/${id}/finance`),
  });
}
