'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/// اختيار الموقع: حقول lat/lng مع معاينة حيّة عبر Google Maps embed
/// (بدون مفتاح API — رابط output=embed الكلاسيكي).
export function LocationPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>خط العرض (lat)</Label>
          <Input
            type="number"
            step="0.0001"
            value={lat}
            dir="ltr"
            onChange={(e) => onChange(Number(e.target.value), lng)}
          />
        </div>
        <div className="space-y-1">
          <Label>خط الطول (lng)</Label>
          <Input
            type="number"
            step="0.0001"
            value={lng}
            dir="ltr"
            onChange={(e) => onChange(lat, Number(e.target.value))}
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <iframe
          title="map"
          src={src}
          className="h-56 w-full"
          loading="lazy"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        عدّل خط العرض والطول لتحريك الدبوس. (تكامل النقر على الخريطة يتطلب مفتاح
        Google Maps API.)
      </p>
    </div>
  );
}
