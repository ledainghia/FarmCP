'use client';

import { useState } from 'react';

import TableCustom from '@/components/table/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DataProps } from '@/type_define/dataProps';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, SquarePen, Trash2 } from 'lucide-react';

type SensorsTableProps = {
  hasTitle?: boolean;
};

export default function SensorsTable({ hasTitle = true }: SensorsTableProps) {
  const DEFAULT_PAGE_SIZE = 10;
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const columns: ColumnDef<DataProps>[] = [
    {
      accessorKey: 'sensorName',
      header: 'Tên cảm biến',
      cell: ({ row }) => <span>{row.getValue('sensorName')}</span>,
    },
    {
      accessorKey: 'sensorType',
      header: 'Loại cảm biến',
      cell: ({ row }) => <span>{row.getValue('sensorType')}</span>,
    },
    {
      accessorKey: 'farm',
      header: 'Chuồng',
      cell: ({ row }) => <span>{row.getValue('farm')}</span>,
    },
    {
      accessorKey: 'pinCode',
      header: 'Mã pin',
      cell: ({ row }) => <span>{row.getValue('pinCode')}</span>,
    },
    {
      accessorKey: 'nodeCode',
      header: 'Mã node',
      cell: ({ row }) => <span>{row.getValue('nodeCode')}</span>,
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='w-7 h-7 text-default-400'
                >
                  <Eye className='w-4 h-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>
                <p>Xem</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='w-7 h-7 text-default-400'
                >
                  <SquarePen className='w-3 h-3' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>
                <p>Sửa</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='w-7 h-7 text-default-400'
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side='top'
                className='bg-destructive text-destructive-foreground'
              >
                <p>Xóa</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  // Dữ liệu giả
  const data = [
    {
      id: 1,
      sensorName: 'Cảm biến nhiệt độ A',
      sensorType: 'Nhiệt độ',
      farm: 'Chuồng A',
      pinCode: 'P1',
      nodeCode: 'N1',
    },
    {
      id: 2,
      sensorName: 'Cảm biến độ ẩm B',
      sensorType: 'Độ ẩm',
      farm: 'Chuồng B',
      pinCode: 'P2',
      nodeCode: 'N2',
    },
    {
      id: 3,
      sensorName: 'Cảm biến ánh sáng C',
      sensorType: 'Ánh sáng',
      farm: 'Chuồng C',
      pinCode: 'P3',
      nodeCode: 'N3',
    },
    {
      id: 4,
      sensorName: 'Cảm biến khí CO2',
      sensorType: 'Khí CO2',
      farm: 'Chuồng D',
      pinCode: 'P4',
      nodeCode: 'N4',
    },
    {
      id: 5,
      sensorName: 'Cảm biến pH',
      sensorType: 'pH',
      farm: 'Chuồng E',
      pinCode: 'P5',
      nodeCode: 'N5',
    },
  ];

  // Phân trang
  const paginatedData = data.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize
  );
  const totalPages = Math.ceil(data.length / pageSize);
  const hasNextPage = pageIndex < totalPages;
  const hasPreviousPage = pageIndex > 1;

  return (
    <TableCustom
      data={paginatedData}
      columns={columns}
      title={hasTitle ? 'Danh sách cảm biến' : ''}
      pageSize={pageSize}
      pageIndex={pageIndex}
      totalItems={data.length}
      totalPages={totalPages}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      setPageSize={setPageSize}
      setPageIndex={setPageIndex}
      header={
        <div className='flex gap-2 w-full'>
          <Input
            className='w-[400px] h-full'
            placeholder='Tìm kiếm cảm biến'
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button>Thêm mới</Button>
        </div>
      }
    />
  );
}
