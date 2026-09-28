import { TOKEN_COOKIE, VENDOR_ID_COOKIE } from './constants';

/// إدارة جلسة المزوّد على العميل.
/// نخزّن التوكن في localStorage (للطلبات) وفي cookie (ليقرأه الـ middleware).

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_COOKIE);
}

export function getVendorId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(VENDOR_ID_COOKIE);
}

export function setSession(token: string, vendorId?: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_COOKIE, token);
  setCookie(TOKEN_COOKIE, token);
  if (vendorId) {
    window.localStorage.setItem(VENDOR_ID_COOKIE, vendorId);
    setCookie(VENDOR_ID_COOKIE, vendorId);
  }
}

export function setActiveVendor(vendorId: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(VENDOR_ID_COOKIE, vendorId);
  setCookie(VENDOR_ID_COOKIE, vendorId);
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_COOKIE);
  window.localStorage.removeItem(VENDOR_ID_COOKIE);
  deleteCookie(TOKEN_COOKIE);
  deleteCookie(VENDOR_ID_COOKIE);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
