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

type ControlDevicesTableProps = {
  hasTitle?: boolean;
};

export default function ControlDevicesTable({
  hasTitle = true,
}: ControlDevicesTableProps) {
  const DEFAULT_PAGE_SIZE = 10;
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const columns: ColumnDef<DataProps>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
      cell: ({ row }) => <span>{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'farmName',
      header: 'Tên Chuồng',
      cell: ({ row }) => <span>{row.getValue('farmName')}</span>,
    },
    {
      accessorKey: 'boardCode',
      header: 'Mã Bảng',
      cell: ({ row }) => <span>{row.getValue('boardCode')}</span>,
    },
    {
      accessorKey: 'pinCode',
      header: 'Mã Pin',
      cell: ({ row }) => <span>{row.getValue('pinCode')}</span>,
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

  // Dữ liệu giả cho thiết bị điều khiển
  const data = [
    {
      id: 1,
      name: 'Quạt gió',
      farmName: 'Chuồng A',
      boardCode: 'QB01',
      pinCode: 'P01',
    },
    {
      id: 2,
      name: 'Hệ thống phun sương',
      farmName: 'Chuồng B',
      boardCode: 'QB02',
      pinCode: 'P02',
    },
    {
      id: 3,
      name: 'Đèn chiếu sáng',
      farmName: 'Chuồng C',
      boardCode: 'QB03',
      pinCode: 'P03',
    },
    {
      id: 4,
      name: 'Máy điều hòa',
      farmName: 'Chuồng D',
      boardCode: 'QB04',
      pinCode: 'P04',
    },
    {
      id: 5,
      name: 'Cửa tự động',
      farmName: 'Chuồng E',
      boardCode: 'QB05',
      pinCode: 'P05',
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
      title={hasTitle ? 'Danh sách thiết bị điều khiển' : ''}
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
            placeholder='Tìm kiếm thiết bị'
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button>Thêm mới</Button>
        </div>
      }
    />
  );
}
