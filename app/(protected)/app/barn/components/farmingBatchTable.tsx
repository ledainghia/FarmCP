import TableCustom from '@/components/table/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEFAULT_PAGE_SIZE } from '@/constant/site';
import { useFarmingBatchQuery } from '@/hooks/use-query';
import { ColumnDef } from '@tanstack/react-table';
import React, { useState } from 'react';

export default function FarmingBatchTable({
  cageID,
  cageName,
}: {
  cageID: string;
  cageName: string;
}) {
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Tên vụ nuôi',
    },
    {
      accessorKey: 'species',
      header: 'Giống loài',
    },
    {
      accessorKey: 'startDate',
      header: 'Ngày bắt đầu',
      cell: ({ row }) => (
        <span>
          {new Date(row.getValue('startDate') as string).toLocaleDateString(
            'vi-VN',
            {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }
          )}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
    },
    {
      accessorKey: 'cleaningFrequency',
      header: 'Tần suất vệ sinh',
    },
    {
      accessorKey: 'quantity',
      header: 'Số lượng',
    },
    {
      accessorKey: 'template.species',
      header: 'Giống loài (Mẫu)',
    },
    {
      accessorKey: 'template.status',
      header: 'Trạng thái giống',
    },
    {
      accessorKey: 'template.notes',
      header: 'Ghi chú giống',
    },
  ];

  const { data } = useFarmingBatchQuery({ cageID });

  return (
    <TableCustom
      title={`Vụ nuôi ở chuồng ${cageName}`}
      data={data?.items ? data?.items : []}
      columns={columns}
      pageSize={data?.pageSize}
      pageIndex={data?.currentPage}
      totalItems={data?.totalItems}
      totalPages={data?.totalPages}
      hasNextPage={data?.hasNextPage}
      hasPreviousPage={data?.hasPreviousPage}
      setPageSize={setPageSize}
      setPageIndex={setPageIndex}
      header={
        <div className='flex gap-2 w-full'>
          <Input
            className='w-[400px] h-full'
            placeholder='Tìm kiếm theo tên hoặc mã sinh viên'
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button>Thêm mới</Button>
        </div>
      }
    />
  );
}
