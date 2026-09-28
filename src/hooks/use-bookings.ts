'use client';

import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { getVendorId } from '@/lib/auth';
import type { Booking, Paginated } from '@/types';

export type BookingRow = Booking & { _customerName: string };

/// اسم عرض للعميل (الخادم يخزّن userId فقط بدون اسم).
function withCustomer(b: Booking): BookingRow {
  return { ...b, _customerName: `عميل ${b.userId.slice(0, 6)}` };
}

interface UseBookingsArgs {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

/// حجوزات المتجر من نقطة /vendors/:id/bookings (ترقيم على الخادم).
export function useBookings({
  status,
  search,
  page = 1,
  pageSize = 20,
}: UseBookingsArgs = {}) {
  const id = typeof window !== 'undefined' ? getVendorId() : null;

  const query = useQuery({
    queryKey: ['bookings', id, status, page, pageSize],
    enabled: !!id,
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      });
      if (status && status !== 'all') params.set('status', status);
      return apiClient.get<Paginated<Booking>>(
        `/vendors/${id}/bookings?${params.toString()}`,
      );
    },
  });

  const rows = useMemo(
    () => (query.data?.items ?? []).map(withCustomer),
    [query.data],
  );

  // بحث على عناصر الصفحة الحالية (الخادم لا يدعم البحث بالاسم).
  const items = useMemo(() => {
    if (!search) return rows;
    const q = search.trim();
    return rows.filter((b) => b._customerName.includes(q) || b.id.includes(q));
  }, [rows, search]);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    items,
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    refetch: query.refetch,
  };
}

/// التحقق من رمز QR عبر الخادم.
export function useVerifyQr() {
  return useMutation({
    mutationFn: ({ bookingId, qrCode }: { bookingId: string; qrCode: string }) =>
      apiClient.post<Booking>(`/bookings/${bookingId}/verify-qr`, { qrCode }),
  });
}
