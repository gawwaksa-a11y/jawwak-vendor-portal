'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stepper } from '@/components/register/stepper';
import { ContractViewer } from '@/components/register/contract-viewer';

export default function RegisterContract() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sign() {
    if (!agreed) {
      toast.error('يجب الموافقة على العقد للمتابعة');
      return;
    }
    setLoading(true);
    // ملاحظة: تسجيل contractSignedAt يتطلب توسيع UpdateVendorDto في الـ Backend.
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success('تم توقيع العقد بنجاح — أهلاً بك في جوّك! 🎉');
    router.push('/dashboard');
  }

  return (
    <div className="mx-auto max-w-xl p-4 md:py-10">
      <Stepper current={3} />
      <Card>
        <CardHeader>
          <CardTitle>العقد والتوقيع الرقمي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <ContractViewer />
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 accent-[#C9A96E]"
            />
            قرأت ووافقت على شروط الاتفاقية ونسبة العمولة 15%.
          </label>
          <Button className="w-full" size="lg" onClick={sign} disabled={loading}>
            {loading ? 'جارٍ التوقيع...' : 'وقّع وابدأ'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
