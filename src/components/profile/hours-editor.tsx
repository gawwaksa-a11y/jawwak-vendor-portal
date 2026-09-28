'use client';

import { WEEK_DAYS } from '@/lib/constants';
import { Input } from '@/components/ui/input';

export type Hours = Record<string, string>; // مثال: { sat: '08:00-23:00' }

/// محرّر ساعات العمل — صف لكل يوم (فتح/إغلاق).
export function HoursEditor({
  value,
  onChange,
}: {
  value: Hours;
  onChange: (v: Hours) => void;
}) {
  function parse(range?: string): [string, string] {
    if (!range || !range.includes('-')) return ['09:00', '23:00'];
    const [o, c] = range.split('-');
    return [o, c];
  }

  function update(key: string, open: string, close: string) {
    onChange({ ...value, [key]: `${open}-${close}` });
  }

  return (
    <div className="space-y-2">
      {WEEK_DAYS.map((d) => {
        const [open, close] = parse(value[d.key]);
        return (
          <div key={d.key} className="flex items-center gap-3">
            <span className="w-16 text-sm font-medium">{d.label}</span>
            <Input
              type="time"
              value={open}
              dir="ltr"
              className="w-32"
              onChange={(e) => update(d.key, e.target.value, close)}
            />
            <span className="text-muted-foreground">—</span>
            <Input
              type="time"
              value={close}
              dir="ltr"
              className="w-32"
              onChange={(e) => update(d.key, open, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}
