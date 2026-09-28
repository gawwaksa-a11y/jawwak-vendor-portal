import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/// تنسيق مبلغ بالريال السعودي.
export function formatSAR(amount: number): string {
  return `${amount.toLocaleString('ar-SA', { maximumFractionDigits: 0 })} ر.س`;
}

/// تنسيق تاريخ مختصر بالعربية.
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(d)} · ${d.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}
