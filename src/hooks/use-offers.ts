'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { getVendorId } from '@/lib/auth';
import type { Offer } from '@/types';

export interface CreateOfferInput {
  title: string;
  discountPct: number;
  startDate: string;
  endDate: string;
}

/// عروض المتجر النشط + عمليات الإنشاء/التحديث/الحذف.
export function useOffers() {
  const id = typeof window !== 'undefined' ? getVendorId() : null;
  const queryClient = useQueryClient();
  const key = ['offers', id];

  const list = useQuery({
    queryKey: key,
    enabled: !!id,
    queryFn: () => apiClient.get<Offer[]>(`/vendors/${id}/offers`),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const create = useMutation({
    mutationFn: (input: CreateOfferInput) =>
      apiClient.post<Offer>('/offers', { vendorId: id, ...input }),
    onSuccess: invalidate,
  });

  const toggle = useMutation({
    mutationFn: ({ offerId, isActive }: { offerId: string; isActive: boolean }) =>
      apiClient.patch<Offer>(`/offers/${offerId}`, { isActive }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (offerId: string) => apiClient.delete(`/offers/${offerId}`),
    onSuccess: invalidate,
  });

  return { list, create, toggle, remove };
}
