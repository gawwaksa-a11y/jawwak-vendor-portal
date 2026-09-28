import { BookingsChart } from '@/components/dashboard/bookings-chart';
import { RatingSummary } from '@/components/dashboard/rating-summary';
import { RecentBookings } from '@/components/dashboard/recent-bookings';
import { StatsCards } from '@/components/dashboard/stats-cards';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">لوحة التحكم</h1>
      <StatsCards />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <BookingsChart />
          <RecentBookings />
        </div>
        <RatingSummary />
      </div>
    </div>
  );
}
