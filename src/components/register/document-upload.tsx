'use client';

import { useRef, useState } from 'react';
import { FileText, UploadCloud } from 'lucide-react';

import { cn } from '@/lib/utils';

/// رفع صورة/ملف السجل التجاري (PDF أو صورة).
export function DocumentUpload({
  onFile,
}: {
  onFile: (name: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function handle(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    setFileName(f.name);
    onFile(f.name);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handle(e.dataTransfer.files);
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-input p-10 text-center',
      )}
    >
      {fileName ? (
        <>
          <FileText className="h-10 w-10 text-primary" />
          <p className="text-sm font-medium">{fileName}</p>
          <p className="text-xs text-muted-foreground">اضغط للاستبدال</p>
        </>
      ) : (
        <>
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            ارفع صورة أو ملف PDF للسجل التجاري
          </p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        hidden
        onChange={(e) => handle(e.target.files)}
      />
    </div>
  );
}
