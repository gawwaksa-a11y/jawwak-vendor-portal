'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stepper } from '@/components/register/stepper';
import { ContractViewer } from '@/components/register/contract-viewer';
import { apiClient } from '@/lib/api-client';
import { getVendorId } from '@/lib/auth';

export default function RegisterContract() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);

  async function sign() {
    if (!agreed) {
      toast.error('يجب الموافقة على العقد للمتابعة');
      return;
    }
    setSigning(true);
    try {
      const vendorId = getVendorId();
      if (vendorId) {
        await apiClient.patch(`/vendors/${vendorId}`, {
          contractSignedAt: new Date().toISOString(),
        });
      }
      router.push('/dashboard');
    } catch (e) {
      toast.error('تعذّر تسجيل التوقيع');
    } finally {
      setSigning(false);
    }
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
          <Button className="w-full" size="lg" onClick={sign} disabled={signing}>
            {signing ? 'جارٍ التوقيع...' : 'وقّع وابدأ'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
