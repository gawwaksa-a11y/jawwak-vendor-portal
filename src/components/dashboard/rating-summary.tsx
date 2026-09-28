'use client';

import { Star } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useReviews, useVendor } from '@/hooks/use-vendor';

export function RatingSummary() {
  const { data: vendor } = useVendor();
  const { data, isLoading } = useReviews();
  const reviews = data?.items ?? [];

  const dist = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
    return { star, count, pct };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>ملخّص التقييمات</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-40" />
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-extrabold">
                {vendor?.avgRating ?? 0}
              </span>
              <div>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4"
                      fill={
                        i < Math.round(vendor?.avgRating ?? 0)
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {vendor?.ratingCount ?? 0} تقييم
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              {dist.map((d) => (
                <div key={d.star} className="flex items-center gap-2 text-sm">
                  <span className="w-4">{d.star}</span>
                  <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-amber-400"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-left text-muted-foreground">
                    {d.pct}%
                  </span>
                </div>
              ))}
            </div>

            {reviews.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                لا توجد تقييمات بعد.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
