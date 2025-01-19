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
import { useCagesQuery } from '@/hooks/use-query';
import { DataProps } from '@/type_define/dataProps';
import { ColumnDef } from '@tanstack/react-table';
import {
  Eye,
  MessageSquareText,
  Search,
  SquarePen,
  Trash2,
} from 'lucide-react';
import { CageDTO } from '@/dtos/CageDTO';
import FarmingBatchTable from './farmingBatchTable';
import AddCageDialog from './addCageDialog';
import { InputIcon } from '@/components/ui/input-icon';

export default function BarnTable({ addNew = true }: { addNew?: boolean }) {
  const DEFAULT_PAGE_SIZE = 20;
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [cagesList, setCagesList] = useState<any[]>([]);
  const { data: cages } = useCagesQuery();

  useEffect(() => {
    if (cages && Array.isArray(cages.items) && cages.items.length > 0) {
      const updatedItems = cages.items.map((item: CageDTO) => ({
        ...item,
        expandedContent: (
          <FarmingBatchTable
            key={item.id}
            cageName={item.name}
            cageID={item.id}
          />
        ),
      }));
      setCagesList(updatedItems);
    }
  }, [cages]);
  const columns: ColumnDef<DataProps>[] = [
    {
      id: 'select',

      meta: 'select',
      cell: ({ row }) => (
        <div className=''>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'ghost'}
                  size='icon'
                  onClick={() => row.toggleExpanded()}
                  className='hover:bg-white hover:text-primary'
                >
                  <Icon
                    icon={
                      row.getIsExpanded()
                        ? 'ic:outline-remove'
                        : 'ic:outline-add'
                    }
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem thông tin vụ nuôi ở chuồng {row.original.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },

    {
      accessorKey: 'name',
      header: 'Tên',
      cell: ({ row }) => <span>{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'farmingBatch.growthStageDetails.name',
      header: 'Vụ nuôi hiện tại',
    },
    {
      accessorKey: 'farmingBatch.quantity',
      header: 'Số lượng vật nuôi trong vụ nuôi hiện tại ',
      meta: 'end',
    },
    {
      accessorKey: 'area',
      header: 'Diện tích',
      meta: 'end',
    },
    { accessorKey: 'capacity', header: 'Sức chứa', meta: 'end' },

    {
      id: 'actions',
      header: 'Hành Động',
      meta: 'center actions',
      size: 3,
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

  return (
    <TableCustom
      data={cagesList}
      columns={columns}
      title='Danh sách chuồng trại'
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
          <InputIcon
            className='w-[400px] h-full '
            endIcon={Search}
            placeholder='Tìm kiếm chuồng trại'
            onChange={(e) => setSearch(e.target.value)}
          />

          {addNew && <AddCageDialog />}
        </div>
      }
    />
  );
}
