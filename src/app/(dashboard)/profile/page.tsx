'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ChipSelector } from '@/components/profile/mood-tags-selector';
import { HoursEditor, type Hours } from '@/components/profile/hours-editor';
import { ImageUploader } from '@/components/profile/image-uploader';
import { LocationPicker } from '@/components/profile/location-picker';
import { apiClient } from '@/lib/api-client';
import { getVendorId } from '@/lib/auth';
import { CATEGORIES, COMPANION_TAGS, MOOD_TAGS, PRICE_RANGES } from '@/lib/constants';
import { useVendor } from '@/hooks/use-vendor';

export default function ProfilePage() {
  const { data: vendor, isLoading } = useVendor();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    if (!vendor) return;
    setNameAr(vendor.businessNameAr);
    setNameEn(vendor.businessNameEn);
    setCategory(vendor.category);
    setPriceRange(vendor.priceRange);
    setAddress(vendor.addressText);
    setLat(vendor.lat);
    setLng(vendor.lng);
    setMood(vendor.moodTags ?? []);
    setCompanion(vendor.companionTags ?? []);
    setHours((vendor.operatingHours as Hours) ?? {});
    setImages(vendor.images ?? []);
  }, [vendor]);

  async function save() {
    const id = getVendorId();
    if (!id) {
      toast.error('لا يوجد متجر مرتبط');
      return;
    }
    setSaving(true);
    try {
      await apiClient.patch(`/vendors/${id}`, {
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
      await queryClient.invalidateQueries({ queryKey: ['vendor'] });
      toast.success('تم حفظ التعديلات');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'تعذّر الحفظ');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) return <Skeleton className="h-96" />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-extrabold">بيانات المتجر</h1>
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الأساسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>الاسم (عربي)</Label>
              <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>الاسم (إنجليزي)</Label>
              <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} dir="ltr" />
            </div>
            <div className="space-y-1">
              <Label>التصنيف</Label>
              <Select options={CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>نطاق الأسعار</Label>
              <Select options={PRICE_RANGES} value={priceRange} onChange={(e) => setPriceRange(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>العنوان</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>الموقع</Label>
            <LocationPicker lat={lat} lng={lng} onChange={(la, ln) => { setLat(la); setLng(ln); }} />
          </div>
          <div className="space-y-2">
            <Label>وسوم المزاج</Label>
            <ChipSelector options={MOOD_TAGS} value={mood} onChange={setMood} />
          </div>
          <div className="space-y-2">
            <Label>وسوم الرفقة</Label>
            <ChipSelector options={COMPANION_TAGS} value={companion} onChange={setCompanion} />
          </div>
          <div className="space-y-2">
            <Label>ساعات العمل</Label>
            <HoursEditor value={hours} onChange={setHours} />
          </div>
          <div className="space-y-2">
            <Label>صور المتجر</Label>
            <ImageUploader value={images} onChange={setImages} />
          </div>
          <Button className="w-full" size="lg" onClick={save} disabled={saving}>
            {saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
