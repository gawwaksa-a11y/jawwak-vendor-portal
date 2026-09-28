'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingDetailDialog } from '@/components/bookings/booking-detail-dialog';
import { useBookings, type BookingRow } from '@/hooks/use-bookings';
import { BOOKING_STATUS } from '@/lib/constants';
import { formatDate, formatSAR } from '@/lib/utils';

export function RecentBookings() {
  const { items, isLoading } = useBookings({ pageSize: 5 });
  const [selected, setSelected] = useState<BookingRow | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>آخر الحجوزات</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العميل</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.slice(0, 5).map((b) => {
                const s = BOOKING_STATUS[b.status];
                return (
                  <TableRow
                    key={b.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(b)}
                  >
                    <TableCell className="font-medium">{b._customerName}</TableCell>
                    <TableCell>{formatDate(b.createdAt)}</TableCell>
                    <TableCell>{formatSAR(Number(b.amount))}</TableCell>
                    <TableCell>
                      <Badge className={s?.color}>{s?.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        <BookingDetailDialog booking={selected} onClose={() => setSelected(null)} />
      </CardContent>
    </Card>
  );
}
