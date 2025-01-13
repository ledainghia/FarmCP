import TableCustom from '@/components/table/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { DEFAULT_PAGE_SIZE } from '@/constant/site';
import { useFarmingBatchQuery } from '@/hooks/use-query';
import { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import AddFarmingBatchDialog from './addFarmingBatchDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { farmsApi } from '@/config/api';
import toast from 'react-hot-toast';

export default function FarmingBatchTable({
  cageID,
  cageName,
}: {
  cageID: string;
  cageName: string;
}) {
  const clientQuery = useQueryClient();
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
      meta: 'end',

      cell: ({ row }) => (
        <div className=''>
          <span>
            {row.getValue('startDate')
              ? new Date(
                  row.getValue('startDate') as string
                ).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : 'Chưa bắt đầu'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      meta: 'center',
      cell: ({ row }) => (
        <Switch
          checked={row.original.status === 'Active' ? true : false}
          onClick={() => {
            handleChangeStatus.mutate({
              farmingBatchId: row.original.id,
              status: row.original.status === 'Active' ? 'Planning' : 'Active',
            });
          }}
        />
      ),
    },
    {
      accessorKey: 'cleaningFrequency',
      header: 'Tần suất vệ sinh',
      meta: 'end',
    },
    {
      accessorKey: 'quantity',
      header: 'Số lượng',
      meta: 'end',
    },
    {
      accessorKey: 'template.species',
      header: 'Giống loài (Mẫu)',
    },
    {
      accessorKey: 'template.status',
      header: 'Trạng thái giống',

      meta: 'center',
      cell: ({ row }) => (
        <Switch
          checked={row.original.template.status === 'Active' ? true : false}
        />
      ),
    },
    {
      accessorKey: 'template.notes',
      header: 'Ghi chú giống',
    },
  ];

  const { data } = useFarmingBatchQuery(cageID);

  const handleChangeStatus = useMutation({
    mutationFn: ({
      farmingBatchId,
      status,
    }: {
      farmingBatchId: string;
      status: string;
    }) => {
      return farmsApi.changeStatusFarmingBatch(farmingBatchId, status);
    },
    onSuccess() {
      toast.success('Chuyển đổi trạng thái vụ nuôi thành công');

      clientQuery.invalidateQueries({ queryKey: ['farmingBatch', cageID] });
    },
    onError(erorr: any) {
      toast.error(
        erorr.response?.data?.result?.message ||
          'Lỗi khi đổi trạng thái của vụ nuôi! Vui lòng kiểm tra lại'
      );
    },
  });

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
            className='w-[400px] h-full '
            endIcon={Search}
            placeholder='Tìm kiếm vụ nuôi'
            onChange={(e) => setSearch(e.target.value)}
          />
          <AddFarmingBatchDialog cageID={cageID} cageName={cageName} />
        </div>
      }
    />
  );
}
