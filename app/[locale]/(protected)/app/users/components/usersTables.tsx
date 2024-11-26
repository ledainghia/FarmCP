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

type UsersTableProps = {
  hasTitle?: boolean;
};

export default function UsersTable({ hasTitle = true }: UsersTableProps) {
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
      accessorKey: 'role',
      header: 'Vai trò',
      cell: ({ row }) => <span>{row.getValue('role')}</span>,
    },
    {
      accessorKey: 'permissions',
      header: 'Quyền hạn',
      cell: ({ row }) => <span>{row.getValue('permissions')}</span>,
    },
    {
      accessorKey: 'isActive',
      header: 'Kích hoạt',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs rounded-md ${
            row.getValue('isActive')
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {row.getValue('isActive') ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
        </span>
      ),
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
      name: 'Nguyễn Văn A',
      role: 'Quản trị viên',
      permissions: 'Toàn quyền',
      isActive: true,
    },
    {
      id: 2,
      name: 'Trần Thị B',
      role: 'Người dùng',
      permissions: 'Hạn chế',
      isActive: false,
    },
    {
      id: 3,
      name: 'Phạm Văn C',
      role: 'Nhân viên',
      permissions: 'Chỉnh sửa',
      isActive: true,
    },
    {
      id: 4,
      name: 'Lê Thị D',
      role: 'Nhân viên',
      permissions: 'Chỉ xem',
      isActive: false,
    },
    {
      id: 5,
      name: 'Võ Minh E',
      role: 'Quản trị viên',
      permissions: 'Toàn quyền',
      isActive: true,
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
      title={hasTitle ? 'Danh sách người dùng' : ''}
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
            placeholder='Tìm kiếm người dùng'
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button>Thêm mới</Button>
        </div>
      }
    />
  );
}
