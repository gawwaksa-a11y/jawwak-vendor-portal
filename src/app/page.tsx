import { redirect } from 'next/navigation';

/// الصفحة الجذر: توجيه للوحة التحكم (الـ middleware يعيد التوجيه للدخول عند اللزوم).
export default function Home() {
  redirect('/dashboard');
}
