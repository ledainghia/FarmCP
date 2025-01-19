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
import { InputIcon } from '@/components/ui/input-icon';
import { swalMixin } from '@/utils/swalMixin';
import Swal from 'sweetalert2';

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

  const swal = ({
    farmingBatchId,
    status,
  }: {
    farmingBatchId: string;
    status: string;
  }) =>
    swalMixin
      .fire({
        title: 'Bạn có chắc chắn hủy vụ nuôi này không?',
        text: 'Hãy chắc chắn rằng bạn đã xem xét kỹ lưỡng trước khi tiếp tục',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Hủy vụ nuôi',
        cancelButtonText: 'Không ',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleChangeStatus.mutate({
            farmingBatchId,
            status,
          });
        }
      });
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Tên vụ nuôi',
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
        <>
          {row.original.status === 'Cancelled' ? (
            <Badge variant={'destructive'} className='rounded-sm'>
              Đã hủy
            </Badge>
          ) : (
            <Switch
              checked={row.original.status === 'Active' ? true : false}
              onClick={() => {
                if (row.original.status !== 'Active')
                  handleChangeStatus.mutate({
                    farmingBatchId: row.original.id,
                    status:
                      row.original.status === 'Active' ? 'Cancelled' : 'Active',
                  });
                if (row.original.status === 'Active') {
                  swal({
                    farmingBatchId: row.original.id,
                    status: 'Cancelled',
                  });
                }
              }}
            />
          )}
        </>
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
          <InputIcon
            className=' h-full '
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
