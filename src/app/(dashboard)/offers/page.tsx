'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useOffers } from '@/hooks/use-offers';
import { formatDate } from '@/lib/utils';

export default function OffersPage() {
  const { list, create, toggle, remove } = useOffers();
  const [title, setTitle] = useState('');
  const [discount, setDiscount] = useState(15);
  const [starts, setStarts] = useState('');
  const [ends, setEnds] = useState('');

  async function addOffer() {
    if (title.length < 2 || !starts || !ends) {
      toast.error('أكمل بيانات العرض');
      return;
    }
    if (discount < 5 || discount > 50) {
      toast.error('نسبة الخصم بين 5% و 50%');
      return;
    }
    try {
      await create.mutateAsync({
        title,
        discountPct: discount,
        startDate: starts,
        endDate: ends,
      });
      setTitle('');
      toast.success('تم إنشاء العرض');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'تعذّر إنشاء العرض');
    }
  }

  const offers = list.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">العروض والخصومات</h1>

      <Card>
        <CardHeader>
          <CardTitle>إنشاء عرض جديد</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1 sm:col-span-2 lg:col-span-1">
            <Label>اسم العرض</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>نسبة الخصم (%)</Label>
            <Input
              type="number"
              min={5}
              max={50}
              value={discount}
              dir="ltr"
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label>من</Label>
            <Input type="date" value={starts} dir="ltr" onChange={(e) => setStarts(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>إلى</Label>
            <Input type="date" value={ends} dir="ltr" onChange={(e) => setEnds(e.target.value)} />
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <Button onClick={addOffer} disabled={create.isPending}>
              <Plus className="h-4 w-4" />
              {create.isPending ? 'جارٍ الإضافة...' : 'إضافة العرض'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>العروض</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {list.isLoading ? (
            <Skeleton className="h-32" />
          ) : offers.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">لا توجد عروض بعد.</p>
          ) : (
            offers.map((o) => {
              const expired = new Date(o.endDate) < new Date();
              return (
                <div
                  key={o.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{o.title}</span>
                      <Badge className="bg-primary/15 text-sand-dark">
                        {o.discountPct}%
                      </Badge>
                      {expired && (
                        <Badge className="bg-gray-100 text-gray-600">منتهٍ</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(o.startDate)} — {formatDate(o.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {o.isActive ? 'مفعّل' : 'موقوف'}
                      </span>
                      <Switch
                        checked={o.isActive}
                        disabled={expired || toggle.isPending}
                        onCheckedChange={(v) =>
                          toggle.mutate({ offerId: o.id, isActive: v })
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600"
                      onClick={() => remove.mutate(o.id)}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        ملاحظة: تُطبّق الخصومات عبر الدفع الإلكتروني فقط لحماية التسويات من
        التجاوز المالي.
      </p>
    </div>
  );
}
