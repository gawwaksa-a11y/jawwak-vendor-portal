'use client';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BOOKING_STATUS } from '@/lib/constants';
import { formatDateTime, formatSAR } from '@/lib/utils';
import type { BookingRow } from '@/hooks/use-bookings';

export function BookingsTable({
  items,
  onRowClick,
}: {
  items: BookingRow[];
  onRowClick: (b: BookingRow) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-muted-foreground">
        لا توجد حجوزات مطابقة.
      </p>
    );
  }

  return (
    <>
      {/* جدول على الشاشات المتوسطة فأكبر */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الحجز</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>التاريخ والوقت</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>الخصم</TableHead>
              <TableHead>الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((b) => {
              const s = BOOKING_STATUS[b.status];
              return (
                <TableRow
                  key={b.id}
                  className="cursor-pointer"
                  onClick={() => onRowClick(b)}
                >
                  <TableCell className="font-mono text-xs">
                    {b.id.toUpperCase()}
                  </TableCell>
                  <TableCell className="font-medium">{b._customerName}</TableCell>
                  <TableCell>{formatDateTime(b.createdAt)}</TableCell>
                  <TableCell>{formatSAR(Number(b.amount))}</TableCell>
                  <TableCell>{Number(b.discountPct)}%</TableCell>
                  <TableCell>
                    <Badge className={s?.color}>{s?.label}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* بطاقات على الجوال */}
      <div className="space-y-3 md:hidden">
        {items.map((b) => {
          const s = BOOKING_STATUS[b.status];
          return (
            <button
              key={b.id}
              onClick={() => onRowClick(b)}
              className="w-full rounded-xl border bg-card p-4 text-right"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{b._customerName}</span>
                <Badge className={s?.color}>{s?.label}</Badge>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatDateTime(b.createdAt)}</span>
                <span className="font-semibold text-foreground">
                  {formatSAR(Number(b.amount))}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
