'use client';

import { useEffect, useRef } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const READER_ID = 'qr-reader';

/// ماسح QR عبر كاميرا الجهاز باستخدام html5-qrcode.
export function QrScanner({
  open,
  onOpenChange,
  onResult,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onResult: (text: string) => void;
}) {
  const scannerRef = useRef<unknown>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        // ننتظر ظهور عنصر القارئ داخل الـ Dialog.
        await new Promise((r) => setTimeout(r, 150));
        if (cancelled) return;
        const scanner = new Html5Qrcode(READER_ID);
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 250 },
          (decodedText: string) => {
            onResult(decodedText);
            onOpenChange(false);
          },
          () => {
            /* تجاهل أخطاء الإطارات */
          },
        );
      } catch {
        /* الكاميرا غير متاحة — يعالجها المستدعي */
      }
    })();

    return () => {
      cancelled = true;
      const s = scannerRef.current as {
        stop: () => Promise<void>;
        clear: () => void;
      } | null;
      if (s) {
        s.stop()
          .then(() => s.clear())
          .catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [open, onOpenChange, onResult]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>مسح رمز QR</DialogTitle>
          <DialogDescription>
            وجّه كاميرا الجهاز نحو رمز العميل للتحقّق من الحجز.
          </DialogDescription>
        </DialogHeader>
        <div
          id={READER_ID}
          className="mx-auto w-full overflow-hidden rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
