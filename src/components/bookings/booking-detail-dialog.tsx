'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BOOKING_STATUS } from '@/lib/constants';
import { formatDateTime, formatSAR } from '@/lib/utils';
import type { BookingRow } from '@/hooks/use-bookings';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function BookingDetailDialog({
  booking,
  onClose,
}: {
  booking: BookingRow | null;
  onClose: () => void;
}) {
  const status = booking ? BOOKING_STATUS[booking.status] : null;
  const amount = Number(booking?.amount ?? 0);
  const discount = Number(booking?.discountPct ?? 0);
  const net = amount * (1 - discount / 100);

  return (
    <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تفاصيل الحجز</DialogTitle>
        </DialogHeader>
        {booking && (
          <div className="space-y-1">
            <Row label="رقم الحجز" value={booking.id.toUpperCase()} />
            <Row label="العميل" value={booking._customerName} />
            <Row label="التاريخ" value={formatDateTime(booking.createdAt)} />
            <Row label="المبلغ" value={formatSAR(amount)} />
            <Row label="الخصم" value={`${discount}%`} />
            <Row label="الصافي" value={formatSAR(net)} />
            <Row label="طريقة الدفع" value={booking.paymentMethod} />
            <Row
              label="الحالة"
              value={
                <Badge className={status?.color}>{status?.label}</Badge>
              }
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
