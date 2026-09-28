'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useReviews, useVendor } from '@/hooks/use-vendor';
import { formatDate } from '@/lib/utils';

const STAR_FILTER = [
  { value: 'all', label: 'كل التقييمات' },
  { value: '5', label: '5 نجوم' },
  { value: '4', label: '4 نجوم' },
  { value: '3', label: '3 نجوم' },
  { value: '2', label: 'نجمتان' },
  { value: '1', label: 'نجمة' },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4" fill={i < n ? 'currentColor' : 'none'} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { data: vendor } = useVendor();
  const { data, isLoading } = useReviews();
  const [filter, setFilter] = useState('all');

  const reviews = (data?.items ?? []).filter(
    (r) => filter === 'all' || r.rating === Number(filter),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">التقييمات</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-4xl font-extrabold">{vendor?.avgRating ?? 0}</p>
            <div className="mt-1 flex justify-center">
              <Stars n={Math.round(vendor?.avgRating ?? 0)} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">متوسط التقييم</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-4xl font-extrabold">{vendor?.ratingCount ?? 0}</p>
            <p className="mt-1 text-sm text-muted-foreground">إجمالي التقييمات</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-5">
            <Select options={STAR_FILTER} value={filter} onChange={(e) => setFilter(e.target.value)} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة التقييمات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-40" />
          ) : reviews.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              لا توجد تقييمات بعد.
            </p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <Stars n={r.rating} />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(r.createdAt)}
                  </span>
                </div>
                {r.comment && <p className="mt-2 text-sm">{r.comment}</p>}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
