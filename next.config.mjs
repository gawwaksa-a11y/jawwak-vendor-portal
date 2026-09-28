// على Vercel (إنتاج/معاينة): نمنع البناء بلا رابط الـ API، وإلا تُضمَّن
// القيمة الافتراضية localhost:3000 في الحزمة بصمت وتتعطّل اللوحة للجميع.
if (process.env.VERCEL && !process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_URL غير مضبوط — أضفه في Vercel → Settings → Environment Variables ' +
      '(مثال: https://<api>.up.railway.app/api/v1)',
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
};

export default nextConfig;
