'use client';

import { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';

interface DataTableProps<T> {
  title?: string;
  columns: Array<{
    key: string;
    label: string;
    width?: string;
    hideOnMobile?: boolean;
    render?: (value: unknown, row: T) => ReactNode;
  }>;
  data: T[];
  onRowClick?: (row: T) => void;
}

export default function DataTable<T extends object>({
  title,
  columns,
  data,
  onRowClick,
}: DataTableProps<T>) {
  const visibleColumns = columns.filter((col) => !col.hideOnMobile);
  
  return (
    <Card className="p-0">
      {title && <div className="px-3 md:px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>}
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
              {visibleColumns.map((column) => (
                <TableHead
                  key={column.key}
                  className={`px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-700 ${
                    column.hideOnMobile ? 'hidden md:table-cell' : ''
                  }`}
                  style={{ width: column.width }}
                >
                  {column.label}
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={visibleColumns.length} className="text-center py-8 text-gray-500 text-sm">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRow
                key={idx}
                onClick={() => onRowClick?.(row)}
                className="hover:bg-gray-50 transition-colors"
              >
                {visibleColumns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={`px-2 md:px-3 py-2 text-sm ${
                      column.hideOnMobile ? 'hidden md:table-cell' : ''
                    }`}
                  >
                    {column.render
                      ? column.render((row as any)[column.key], row)
                      : String((row as any)[column.key] || '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
