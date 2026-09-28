'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { COMMISSION_PCT } from '@/lib/constants';
import { formatSAR } from '@/lib/utils';

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? 'text-lg font-extrabold' : 'font-medium'}>{value}</span>
    </div>
  );
}

export function PayoutSummary({
  totalBookings,
  revenue,
  from,
  to,
}: {
  totalBookings: number;
  revenue: number;
  from: string;
  to: string;
}) {
  const commission = Math.round(revenue * (COMMISSION_PCT / 100));
  const net = revenue - commission;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>ملخّص التسوية الأسبوعية</CardTitle>
        <Badge className="bg-amber-100 text-amber-800">قيد المعالجة</Badge>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-sm text-muted-foreground">
          الفترة: {from} — {to}
        </p>
        <Line label="إجمالي الحجوزات" value={String(totalBookings)} />
        <Line label="إجمالي الإيرادات" value={formatSAR(revenue)} />
        <Line label={`عمولة جوّك (${COMMISSION_PCT}%)`} value={`- ${formatSAR(commission)}`} />
        <Line label="صافي المبلغ" value={formatSAR(net)} strong />
      </CardContent>
    </Card>
  );
}
