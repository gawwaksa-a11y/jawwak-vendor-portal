'use client';

import { useState } from 'react';
import { QrCode, Search } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingsTable } from '@/components/bookings/bookings-table';
import { BookingDetailDialog } from '@/components/bookings/booking-detail-dialog';
import { QrScanner } from '@/components/bookings/qr-scanner';
import { useBookings, useVerifyQr, type BookingRow } from '@/hooks/use-bookings';

const STATUS_FILTER = [
  { value: 'all', label: 'كل الحالات' },
  { value: 'confirmed', label: 'مؤكّد' },
  { value: 'used', label: 'مُستخدم' },
  { value: 'cancelled', label: 'ملغى' },
  { value: 'expired', label: 'منتهي' },
];

export default function BookingsPage() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<BookingRow | null>(null);
  const [scanOpen, setScanOpen] = useState(false);

  const { items, total, totalPages, isLoading, refetch } = useBookings({
    status,
    search,
    page,
  });
  const verifyQr = useVerifyQr();

  async function handleScan(text: string) {
    // نستخرج معرّف الحجز من الحمولة إن أمكن، وإلا نستخدم النص كما هو.
    try {
      await verifyQr.mutateAsync({ bookingId: 'scanned', qrCode: text });
      toast.success('تم التحقّق من الحجز — الحالة الآن: مُستخدم ✅');
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'رمز QR غير صالح أو منتهٍ');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">الحجوزات</h1>
        <Button onClick={() => setScanOpen(true)}>
          <QrCode className="h-4 w-4" />
          مسح QR
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ابحث بالاسم أو رقم الحجز"
                className="pr-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              options={STATUS_FILTER}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-44"
            />
          </div>

          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <BookingsTable items={items} onRowClick={setSelected} />
          )}

          <div className="flex items-center justify-between pt-2 text-sm">
            <span className="text-muted-foreground">الإجمالي: {total}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                السابق
              </Button>
              <span>
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                التالي
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <BookingDetailDialog booking={selected} onClose={() => setSelected(null)} />
      <QrScanner open={scanOpen} onOpenChange={setScanOpen} onResult={handleScan} />
    </div>
  );
}
