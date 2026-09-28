'use client';

import { useMemo } from 'react';

import { PayoutSummary } from '@/components/finance/payout-summary';
import { RevenueChart } from '@/components/finance/revenue-chart';
import {
  TransactionsTable,
  type TxnRow,
} from '@/components/finance/transactions-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookings } from '@/hooks/use-bookings';
import { useFinance } from '@/hooks/use-vendor';
import { COMMISSION_PCT } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export default function FinancePage() {
  const finance = useFinance();
  const { items, isLoading: bookingsLoading } = useBookings({ pageSize: 200 });

  const { rows, from, to } = useMemo(() => {
    const paid = items.filter(
      (b) => b.status === 'used' || b.status === 'confirmed',
    );
    const txns: TxnRow[] = paid.map((b) => {
      const amount = Number(b.amount);
      const discount = Number(b.discountPct);
      const netBefore = amount * (1 - discount / 100);
      const commission = Math.round(netBefore * (COMMISSION_PCT / 100));
      return {
        id: b.id,
        name: b._customerName,
        date: b.createdAt,
        amount,
        discount,
        commission,
        net: Math.round(netBefore - commission),
      };
    });
    const dates = paid.map((b) => new Date(b.createdAt).getTime());
    return {
      rows: txns,
      from: dates.length ? formatDate(new Date(Math.min(...dates))) : '—',
      to: dates.length ? formatDate(new Date(Math.max(...dates))) : '—',
    };
  }, [items]);

  if (finance.isLoading || bookingsLoading) {
    return <Skeleton className="h-96" />;
  }

  const f = finance.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">التقرير المالي</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <PayoutSummary
          totalBookings={f?.totalBookings ?? 0}
          revenue={f?.totalRevenue ?? 0}
          from={from}
          to={to}
        />
        <RevenueChart data={f?.weekly ?? []} />
      </div>
      <TransactionsTable rows={rows} />
    </div>
  );
}
