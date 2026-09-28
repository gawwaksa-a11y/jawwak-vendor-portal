'use client';

import { BookingsChart } from '@/components/dashboard/bookings-chart';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RevenueChart } from '@/components/finance/revenue-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/use-analytics';

export default function AnalyticsPage() {
  const { stats, weeklyRevenue } = useAnalytics();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">التحليلات</h1>
      <StatsCards />
      <div className="grid gap-6 lg:grid-cols-2">
        <BookingsChart />
        <RevenueChart data={weeklyRevenue} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>قمع التحويل</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3 text-center">
          <div>
            <p className="text-3xl font-extrabold text-sky">{stats?.views ?? 0}</p>
            <p className="text-sm text-muted-foreground">مشاهدة</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-sand-dark">
              {stats?.bookings ?? 0}
            </p>
            <p className="text-sm text-muted-foreground">حجز</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-500">
              {Math.round((stats?.conversionRate ?? 0) * 100)}%
            </p>
            <p className="text-sm text-muted-foreground">معدّل التحويل</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
