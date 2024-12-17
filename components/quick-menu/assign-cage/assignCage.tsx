'use client';

import { useEffect, useState } from 'react';

import TableCustom from '@/components/table/table';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCagesQuery, useStaffOfFarmQuery } from '@/hooks/use-query';
import { DataProps } from '@/type_define/dataProps';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, SquarePen, Trash2 } from 'lucide-react';
import farmStore from '@/config/zustandStore/farmStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AssignCage({ addNew = true }: { addNew?: boolean }) {
  const DEFAULT_PAGE_SIZE = 20;
  const { farm } = farmStore();
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [cagesList, setCagesList] = useState<any[]>([]);
  const { data: cages } = useCagesQuery();
  const { data: staffList } = useStaffOfFarmQuery(farm?.id ?? '');

  useEffect(() => {
    if (cages) {
      setCagesList(cages.items);
    }
  }, [cages]);
  const columns: ColumnDef<DataProps>[] = [
    {
      accessorKey: 'name',
      header: 'Tên',
      cell: ({ row }) => <span>{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'assign',
      header: 'Phân công',

      cell: ({ row }) =>
        editMode ? (
          <>
            <Select defaultValue={row.original.staffId}>
              <SelectTrigger>
                <SelectValue placeholder='' />
              </SelectTrigger>

              <SelectContent>
                {staffList?.items.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ) : (
          <div>{row.original.staffName}</div>
        ),
    },
  ];

  return (
    <TableCustom
      data={cagesList}
      columns={columns}
      title='Phân công chuồng'
      pageSize={cages?.pageSize}
      pageIndex={cages?.currentPage}
      totalItems={cages?.totalItems}
      totalPages={cages?.totalPages}
      hasNextPage={cages?.hasNextPage}
      hasPreviousPage={cages?.hasPreviousPage}
      setPageSize={setPageSize}
      setPageIndex={setPageIndex}
      header={
        <div className='flex gap-2 w-full'>
          <Input
            className='w-[400px] h-full'
            placeholder='Tìm kiếm theo tên hoặc mã sinh viên'
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            onClick={(e) => {
              setEditMode(!editMode);
            }}
            variant={editMode ? 'outline' : 'default'}
            color={editMode ? 'destructive' : 'default'}
          >
            {!editMode ? 'Chỉnh sửa' : 'Hủy bỏ'}
          </Button>
          {editMode ? <Button>Lưu</Button> : <></>}
        </div>
      }
    />
  );
}
