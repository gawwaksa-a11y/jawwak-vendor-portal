'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const { requestOtp, verifyOtp, loading, error } = useAuth();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  async function handleSend() {
    if (!/^05\d{8}$/.test(phone)) {
      toast.error('أدخل رقم جوال سعودي صحيح (05xxxxxxxx)');
      return;
    }
    try {
      await requestOtp(phone);
      setSent(true);
      setSeconds(60);
      toast.success('أرسلنا رمز التحقق على جوالك');
    } catch {
      // الخطأ يُعرض من خلال error في useAuth
    }
  }

  async function handleVerify() {
    const ok = await verifyOtp(phone, code);
    if (!ok && error) toast.error(error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sand-light/30 to-background p-4">
      {/* حاوية غير مرئية مطلوبة لـ Firebase RecaptchaVerifier */}
      <div id="recaptcha-container" />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 text-4xl">🧭</div>
          <CardTitle className="text-2xl">لوحة مزوّدي جوّك</CardTitle>
          <CardDescription>
            {sent ? 'أدخل رمز التحقق المُرسل' : 'سجّل الدخول برقم جوالك'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!sent ? (
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الجوال</Label>
              <Input
                id="phone"
                inputMode="numeric"
                placeholder="05xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                className="text-center"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="otp">رمز التحقق</Label>
              <Input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                dir="ltr"
                className="text-center text-2xl tracking-[0.5em]"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{seconds > 0 ? `إعادة الإرسال خلال ${seconds}ث` : ''}</span>
                <button
                  type="button"
                  disabled={seconds > 0}
                  onClick={handleSend}
                  className="text-secondary disabled:opacity-40"
                >
                  إعادة إرسال الرمز
                </button>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={loading}
            onClick={sent ? handleVerify : handleSend}
          >
            {loading ? '...' : sent ? 'تحقّق ودخول' : 'أرسل رمز التحقق'}
          </Button>

          {sent && (
            <p className="text-center text-xs text-muted-foreground">
              حساب جديد؟ سيتم توجيهك لإكمال التسجيل بعد التحقق.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
