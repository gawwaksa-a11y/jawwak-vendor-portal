import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = ['البيانات الأساسية', 'السجل التجاري', 'العقد والتوقيع'];

/// مؤشّر خطوات التسجيل (1-2-3).
export function Stepper({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold',
                  done && 'border-primary bg-primary text-primary-foreground',
                  active && 'border-primary text-sand-dark',
                  !done && !active && 'border-input text-muted-foreground',
                )}
              >
                {done ? <Check className="h-5 w-5" /> : step}
              </div>
              <span
                className={cn(
                  'text-xs',
                  active ? 'font-semibold text-foreground' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'mb-5 h-0.5 w-10',
                  step < current ? 'bg-primary' : 'bg-input',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
