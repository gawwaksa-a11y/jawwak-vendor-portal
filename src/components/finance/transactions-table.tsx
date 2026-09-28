'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, formatSAR } from '@/lib/utils';

export interface TxnRow {
  id: string;
  name: string;
  date: string;
  amount: number;
  discount: number;
  commission: number;
  net: number;
}

export function TransactionsTable({ rows }: { rows: TxnRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>سجل المعاملات</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>التاريخ</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>الخصم</TableHead>
              <TableHead>العمولة</TableHead>
              <TableHead>الصافي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{formatDate(t.date)}</TableCell>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>{formatSAR(t.amount)}</TableCell>
                <TableCell>{t.discount}%</TableCell>
                <TableCell className="text-rose-600">- {formatSAR(t.commission)}</TableCell>
                <TableCell className="font-semibold">{formatSAR(t.net)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
