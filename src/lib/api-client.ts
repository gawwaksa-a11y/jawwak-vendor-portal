import { API_BASE_URL } from './constants';
import { getToken } from './auth';
import type { ApiEnvelope } from '@/types';

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('تعذّر الاتصال بالخادم، تحقّق من الإنترنت');
  }

  let body: ApiEnvelope<T> | null = null;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    body = null;
  }

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jawwak_token');
      localStorage.removeItem('jawwak_vendor_id');
      document.cookie = 'jawwak_token=; Max-Age=0; path=/';
      document.cookie = 'jawwak_vendor_id=; Max-Age=0; path=/';
      window.location.href = '/login';
    }
  }

  if (!res.ok || (body && body.success === false)) {
    const msg = body?.message;
    const text = Array.isArray(msg) ? msg[0] : msg;
    throw new ApiError(
      text ?? messageForStatus(res.status),
      res.status,
    );
  }

  // مظروف الخادم: { success, data }
  return (body && 'data' in body ? body.data : (body as unknown)) as T;
}

function messageForStatus(status: number): string {
  switch (status) {
    case 401:
      return 'انتهت جلستك، سجّل الدخول من جديد';
    case 403:
      return 'ليس لديك صلاحية لهذا الإجراء';
    case 404:
      return 'العنصر المطلوب غير موجود';
    case 429:
      return 'طلبات كثيرة، حاول بعد قليل';
    default:
      return status >= 500 ? 'خطأ في الخادم، حاول لاحقاً' : 'حدث خطأ غير متوقّع';
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
