'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarCheck,
  Percent,
  Star,
  Store,
  Target,
  Users,
  Wand2,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useKpis, useKpisTimeseries } from '@/hooks/use-kpis';

// أهداف الشهر الأول (من خطة الإطلاق).
const TARGETS = {
  vendors: 20,
  usersRegistered: 500,
  moodSessions: 300,
  bookingsCompleted: 100,
  conversionRate: 0.33,
  avgRating: 4.0,
};

function pct(value: number, target: number) {
  return Math.min(100, Math.round((value / target) * 100));
}

export default function AdminKpisPage() {
  const router = useRouter();

  useEffect(() => {
    const isAdmin =
      typeof window !== 'undefined' &&
      localStorage.getItem('jawwak_is_admin') === 'true';
    if (!isAdmin) {
      router.replace('/dashboard');
    }
  }, [router]);

  const { data, isLoading } = useKpis();
  const ts = useKpisTimeseries(14);
  const series = (ts.data ?? []).map((p) => ({
    ...p,
    label: p.date.slice(5).replace('-', '/'), // MM/DD
  }));

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold">لوحة المؤسّس</h1>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { icon: Store, label: 'مزوّدون مسجّلون', value: data.vendors, target: TARGETS.vendors, color: 'text-sand-dark' },
    { icon: Users, label: 'مستخدمون مسجّلون', value: data.usersRegistered, target: TARGETS.usersRegistered, color: 'text-sky' },
    { icon: Wand2, label: 'جلسات مزاج', value: data.moodSessions, target: TARGETS.moodSessions, color: 'text-violet-500' },
    { icon: CalendarCheck, label: 'حجوزات مكتملة', value: data.bookingsCompleted, target: TARGETS.bookingsCompleted, color: 'text-emerald-500' },
  ];

  const rows = [
    { label: 'مزوّدون مسجّلون', value: String(data.vendors), target: String(TARGETS.vendors), p: pct(data.vendors, TARGETS.vendors) },
    { label: 'مستخدمون مسجّلون', value: String(data.usersRegistered), target: String(TARGETS.usersRegistered), p: pct(data.usersRegistered, TARGETS.usersRegistered) },
    { label: 'جلسات مزاج مكتملة', value: String(data.moodSessions), target: String(TARGETS.moodSessions), p: pct(data.moodSessions, TARGETS.moodSessions) },
    { label: 'حجوزات مكتملة', value: String(data.bookingsCompleted), target: String(TARGETS.bookingsCompleted), p: pct(data.bookingsCompleted, TARGETS.bookingsCompleted) },
    { label: 'معدّل التحويل', value: `${Math.round(data.conversionRate * 100)}%`, target: '33%', p: pct(data.conversionRate, TARGETS.conversionRate) },
    { label: 'متوسط التقييم', value: `${data.avgRating}`, target: '4.0+', p: pct(data.avgRating, TARGETS.avgRating) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">لوحة المؤسّس — مؤشّرات الإطلاق</h1>
        <span className="text-xs text-muted-foreground">
          محدّثة: {new Date(data.generatedAt).toLocaleString('ar-SA')}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const p = pct(c.value, c.target);
          return (
            <Card key={c.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{c.label}</p>
                    <p className="mt-1 text-2xl font-extrabold">
                      {c.value}
                      <span className="text-sm font-normal text-muted-foreground">
                        {' '}/ {c.target}
                      </span>
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${c.color}`} />
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${p}%` }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Target className="h-7 w-7 text-emerald-500" />
            <div>
              <p className="text-sm text-muted-foreground">معدّل التحويل</p>
              <p className="text-xl font-extrabold">
                {Math.round(data.conversionRate * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Star className="h-7 w-7 text-amber-400" />
            <div>
              <p className="text-sm text-muted-foreground">متوسط التقييم</p>
              <p className="text-xl font-extrabold">{data.avgRating}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Percent className="h-7 w-7 text-sky" />
            <div>
              <p className="text-sm text-muted-foreground">مستخدمون نشطون</p>
              <p className="text-xl font-extrabold">{data.activeUsers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>النشاط اليومي — آخر 14 يوماً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="gBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A96E" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#C9A96E" stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="gSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5BA4CF" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#5BA4CF" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--card))',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="sessions" name="جلسات المزاج" stroke="#5BA4CF" strokeWidth={2} fill="url(#gSessions)" />
                <Area type="monotone" dataKey="bookings" name="الحجوزات" stroke="#C9A96E" strokeWidth={2} fill="url(#gBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>مؤشّرات النجاح — أهداف الشهر الأول</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المؤشّر</TableHead>
                <TableHead>الحالي</TableHead>
                <TableHead>الهدف</TableHead>
                <TableHead>الإنجاز</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.label}>
                  <TableCell className="font-medium">{r.label}</TableCell>
                  <TableCell>{r.value}</TableCell>
                  <TableCell>{r.target}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        r.p >= 100
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.p >= 50
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                      }
                    >
                      {r.p}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
