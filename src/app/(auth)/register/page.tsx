'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Stepper } from '@/components/register/stepper';
import { ChipSelector } from '@/components/profile/mood-tags-selector';
import { HoursEditor, type Hours } from '@/components/profile/hours-editor';
import { ImageUploader } from '@/components/profile/image-uploader';
import { LocationPicker } from '@/components/profile/location-picker';
import { apiClient } from '@/lib/api-client';
import { setActiveVendor } from '@/lib/auth';
import { CATEGORIES, COMPANION_TAGS, MOOD_TAGS, PRICE_RANGES } from '@/lib/constants';
import type { Vendor } from '@/types';

export default function RegisterStep1() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('restaurant');
  const [priceRange, setPriceRange] = useState('mid');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(24.7136);
  const [lng, setLng] = useState(46.6753);
  const [mood, setMood] = useState<string[]>([]);
  const [companion, setCompanion] = useState<string[]>([]);
  const [hours, setHours] = useState<Hours>({});
  const [images, setImages] = useState<string[]>([]);

  async function submit() {
    if (nameAr.length < 2 || nameEn.length < 2 || address.length < 2) {
      toast.error('أكمل الاسم التجاري والعنوان');
      return;
    }
    if (mood.length === 0 || companion.length === 0) {
      toast.error('اختر وسم مزاج ورفقة واحداً على الأقل');
      return;
    }
    setLoading(true);
    try {
      const vendor = await apiClient.post<Vendor>('/vendors', {
        businessNameAr: nameAr,
        businessNameEn: nameEn,
        category,
        priceRange,
        addressText: address,
        lat,
        lng,
        moodTags: mood,
        companionTags: companion,
        operatingHours: hours,
        images,
      });
      setActiveVendor(vendor.id);
      toast.success('تم حفظ بيانات المتجر');
      router.push('/register/documents');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'تعذّر الحفظ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4 md:py-10">
      <Stepper current={1} />
      <Card>
        <CardHeader>
          <CardTitle>البيانات الأساسية للمتجر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>الاسم التجاري (عربي)</Label>
              <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>الاسم التجاري (إنجليزي)</Label>
              <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} dir="ltr" />
            </div>
            <div className="space-y-1">
              <Label>التصنيف</Label>
              <Select
                options={CATEGORIES}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>نطاق الأسعار</Label>
              <Select
                options={PRICE_RANGES}
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>العنوان</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>الموقع على الخريطة</Label>
            <LocationPicker
              lat={lat}
              lng={lng}
              onChange={(la, ln) => {
                setLat(la);
                setLng(ln);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>وسوم المزاج</Label>
            <ChipSelector options={MOOD_TAGS} value={mood} onChange={setMood} />
          </div>

          <div className="space-y-2">
            <Label>وسوم الرفقة</Label>
            <ChipSelector
              options={COMPANION_TAGS}
              value={companion}
              onChange={setCompanion}
            />
          </div>

          <div className="space-y-2">
            <Label>ساعات العمل</Label>
            <HoursEditor value={hours} onChange={setHours} />
          </div>

          <div className="space-y-2">
            <Label>صور المتجر (3–8)</Label>
            <ImageUploader value={images} onChange={setImages} />
          </div>

          <Button className="w-full" size="lg" onClick={submit} disabled={loading}>
            {loading ? 'جارٍ الحفظ...' : 'التالي: السجل التجاري'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
