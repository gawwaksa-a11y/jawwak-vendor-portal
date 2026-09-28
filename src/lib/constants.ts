export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export const COMMISSION_PCT = 15; // عمولة جوّك

export const TOKEN_COOKIE = 'jawwak_vendor_token';
export const VENDOR_ID_COOKIE = 'jawwak_vendor_id';

export const CATEGORIES = [
  { value: 'restaurant', label: 'مطعم' },
  { value: 'cafe', label: 'مقهى' },
  { value: 'activity', label: 'نشاط' },
  { value: 'food_truck', label: 'عربة طعام' },
  { value: 'event', label: 'فعالية' },
] as const;

export const PRICE_RANGES = [
  { value: 'budget', label: 'اقتصادي' },
  { value: 'mid', label: 'متوسط' },
  { value: 'premium', label: 'مميّز' },
] as const;

export const MOOD_TAGS = [
  { value: 'calm', label: 'هدوء', emoji: '🌿' },
  { value: 'excitement', label: 'حماس', emoji: '⚡' },
  { value: 'explore', label: 'استكشاف', emoji: '🧭' },
  { value: 'food', label: 'أكل', emoji: '🍽️' },
] as const;

export const COMPANION_TAGS = [
  { value: 'solo', label: 'فردي' },
  { value: 'duo', label: 'ثنائي' },
  { value: 'family', label: 'عائلي' },
  { value: 'group', label: 'جماعي' },
] as const;

export const WEEK_DAYS = [
  { key: 'sat', label: 'السبت' },
  { key: 'sun', label: 'الأحد' },
  { key: 'mon', label: 'الاثنين' },
  { key: 'tue', label: 'الثلاثاء' },
  { key: 'wed', label: 'الأربعاء' },
  { key: 'thu', label: 'الخميس' },
  { key: 'fri', label: 'الجمعة' },
] as const;

export const BOOKING_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'مؤكّد', color: 'bg-sky-100 text-sky-800' },
  used: { label: 'مُستخدم', color: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'ملغى', color: 'bg-rose-100 text-rose-800' },
  expired: { label: 'منتهي', color: 'bg-gray-100 text-gray-700' },
};
