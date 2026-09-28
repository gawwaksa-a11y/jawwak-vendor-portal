'use client';

import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
  emoji?: string;
}

interface ChipSelectorProps {
  options: readonly Option[];
  value: string[];
  onChange: (value: string[]) => void;
}

/// اختيار متعدّد على شكل رقاقات (chips) — يُستخدم لوسوم المزاج والرفقة.
export function ChipSelector({ options, value, onChange }: ChipSelectorProps) {
  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              active
                ? 'border-primary bg-primary/15 text-sand-dark'
                : 'border-input hover:bg-accent',
            )}
          >
            {o.emoji ? `${o.emoji} ` : ''}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
