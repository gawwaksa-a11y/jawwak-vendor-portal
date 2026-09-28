'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stepper } from '@/components/register/stepper';
import { DocumentUpload } from '@/components/register/document-upload';
import { apiClient } from '@/lib/api-client';
import { getVendorId } from '@/lib/auth';

export default function RegisterDocuments() {
  const router = useRouter();
  const [crNumber, setCrNumber] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!fileName) {
      toast.error('ارفع صورة السجل التجاري');
      return;
    }
    if (crNumber.length < 6) {
      toast.error('أدخل رقم سجل تجاري صحيح');
      return;
    }
    setLoading(true);
    try {
      const id = getVendorId();
      if (id) await apiClient.patch(`/vendors/${id}`, { crNumber });
      toast.success('تم استلام مستنداتك');
      router.push('/register/contract');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'تعذّر الحفظ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-4 md:py-10">
      <Stepper current={2} />
      <Card>
        <CardHeader>
          <CardTitle>السجل التجاري</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <DocumentUpload onFile={setFileName} />
          <div className="space-y-1">
            <Label>رقم السجل التجاري</Label>
            <Input
              value={crNumber}
              onChange={(e) => setCrNumber(e.target.value.replace(/\D/g, ''))}
              dir="ltr"
              placeholder="1010xxxxxx"
            />
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-sky/10 p-3 text-sm text-sky-dark">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>سيتم التحقق من بياناتك خلال 24–48 ساعة.</span>
          </div>
          <Button className="w-full" size="lg" onClick={submit} disabled={loading}>
            {loading ? 'جارٍ الحفظ...' : 'التالي: العقد'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
