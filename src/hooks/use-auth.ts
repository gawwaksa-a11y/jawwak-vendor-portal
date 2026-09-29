'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth';

import { auth } from '@/lib/firebase';
import { apiClient } from '@/lib/api-client';
import { clearSession, setActiveVendor, setSession } from '@/lib/auth';
import type { Vendor } from '@/types';

interface VerifyResponse {
  user: { id: string; phone: string };
  token?: string;
  accessToken?: string;
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  /// إرسال رمز التحقق عبر Firebase Phone Auth.
  async function requestOtp(phone: string): Promise<void> {
    setError(null);
    setLoading(true);
    try {
      // تأكّد من وجود عنصر الـ recaptcha في الصفحة، وأنشئه إن لم يكن موجوداً.
      let recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        recaptchaContainer = document.createElement('div');
        recaptchaContainer.id = 'recaptcha-container';
        document.body.appendChild(recaptchaContainer);
      }

      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });

      // حوّل الرقم السعودي إلى صيغة E.164 (05xxxxxxxx → +9665xxxxxxxx).
      const e164Phone = phone.startsWith('+')
        ? phone
        : `+966${phone.replace(/^0/, '')}`;

      const confirmation = await signInWithPhoneNumber(auth, e164Phone, verifier);
      confirmationRef.current = confirmation;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذّر إرسال رمز التحقق');
      throw e;
    } finally {
      setLoading(false);
    }
  }

  /// التحقق من الرمز عبر Firebase، ثم إرسال idToken للخادم.
  async function verifyOtp(phone: string, code: string): Promise<boolean> {
    setError(null);
    if (!confirmationRef.current) {
      setError('يرجى إرسال رمز التحقق أولاً');
      return false;
    }
    setLoading(true);
    try {
      const userCredential = await confirmationRef.current.confirm(code);
      const idToken = await userCredential.user.getIdToken();

      const res = await apiClient.post<VerifyResponse>('/auth/verify-token', {
        idToken,
      });
      const token = res.token ?? res.accessToken ?? '';
      setSession(token);

      // نربط متجر المزوّد الحالي عبر نقطة /vendors/mine.
      try {
        const mine = await apiClient.get<Vendor>('/vendors/mine');
        if (mine?.id) setActiveVendor(mine.id);
      } catch {
        /* لا يوجد متجر بعد — يكمل المزوّد التسجيل */
      }

      router.push('/dashboard');
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذّر تسجيل الدخول');
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearSession();
    router.push('/login');
  }

  return { requestOtp, verifyOtp, logout, loading, error };
}
