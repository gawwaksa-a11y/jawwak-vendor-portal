'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const [phone, setPhone] = useState('');
  const [iban, setIban] = useState('');
  const [notif, setNotif] = useState(true);
  const [confirmText, setConfirmText] = useState('');

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-extrabold">الإعدادات</h1>

      <Card>
        <CardHeader>
          <CardTitle>الحساب</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>رقم الجوال</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" placeholder="05xxxxxxxx" />
          </div>
          <div className="space-y-1">
            <Label>الآيبان (IBAN) للتسويات</Label>
            <Input value={iban} onChange={(e) => setIban(e.target.value)} dir="ltr" placeholder="SA00 0000 0000 0000 0000 0000" />
          </div>
          <Button onClick={() => toast.success('تم حفظ بيانات الحساب')}>
            حفظ
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>التفضيلات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>الإشعارات</Label>
            <Switch checked={notif} onCheckedChange={setNotif} />
          </div>
          <div className="flex items-center justify-between">
            <Label>الوضع الليلي</Label>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label>اللغة</Label>
            <Select
              className="w-40"
              options={[
                { value: 'ar', label: 'العربية' },
                { value: 'en', label: 'English' },
              ]}
              defaultValue="ar"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-600">منطقة الخطر</CardTitle>
        </CardHeader>
        <CardContent>
          <DeleteAccountDialog
            confirmText={confirmText}
            setConfirmText={setConfirmText}
            onConfirm={() => {
              toast.success('تم استلام طلب حذف الحساب');
              logout();
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function DeleteAccountDialog({
  confirmText,
  setConfirmText,
  onConfirm,
}: {
  confirmText: string;
  setConfirmText: (v: string) => void;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        حذف الحساب
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد حذف الحساب</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          هذا الإجراء لا يمكن التراجع عنه. اكتب <strong>حذف</strong> للتأكيد.
        </p>
        <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={confirmText !== 'حذف'}
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
          >
            حذف نهائي
          </Button>
          <DialogClose asChild>
            <Button variant="outline">إلغاء</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
