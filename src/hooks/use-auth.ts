'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { apiClient } from '@/lib/api-client';
import { clearSession, setActiveVendor, setSession } from '@/lib/auth';
import type { AuthUser, Vendor } from '@/types';

const MOCK_OTP = '1234';

interface VerifyResponse {
  user: AuthUser;
  token?: string;
  accessToken?: string;
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /// إرسال رمز التحقق (محاكاة — للتجربة استخدم 1234).
  async function requestOtp(): Promise<void> {
    setError(null);
    await new Promise((r) => setTimeout(r, 500));
  }

  /// التحقق من الرمز وتبادل التوكن مع الخادم، ثم ربط أول متجر كـ "متجري".
  async function verifyOtp(phone: string, code: string): Promise<boolean> {
    setError(null);
    if (code !== MOCK_OTP) {
      setError('رمز التحقق غير صحيح');
      return false;
    }
    setLoading(true);
    try {
      const res = await apiClient.post<VerifyResponse>('/auth/verify-token', {
        idToken: 'dev-firebase-id-token',
      });
      const token = res.token ?? res.accessToken ?? 'dev';
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
