'use client';

import { useEffect, useState } from 'react';

import TableCustom from '@/components/table/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DataProps } from '@/type_define/dataProps';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, SquarePen, Trash2 } from 'lucide-react';
import SensorsTable from '../../sensors/components/sensorsTables';
import ControlDevicesTable from '../../control_device/components/controlDevicesTable';
import { useCagesQuery } from '@/hooks/use-query';

export default function BarnTable() {
  const DEFAULT_PAGE_SIZE = 20;
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [cagesList, setCagesList] = useState<any[]>([]);
  const { data: cages } = useCagesQuery();

  useEffect(() => {
    if (cages) {
      setCagesList(cages.items);
    }
  }, [cages]);
  const columns: ColumnDef<DataProps>[] = [
    {
      id: 'select',
      size: 3,
      cell: ({ row }) => (
        <div className=''>
          <Button
            variant={'ghost'}
            size='sm'
            onClick={() => row.toggleExpanded()}
            className='hover:bg-white hover:text-primary'
          >
            <Icon
              icon={
                row.getIsExpanded() ? 'ic:outline-remove' : 'ic:outline-add'
              }
            />
          </Button>
        </div>
      ),
    },

    {
      accessorKey: 'name',
      header: 'Tên',
      cell: ({ row }) => <span>{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'detail',
      header: 'Chi tiết',
      cell: ({ row }) => <span>{row.getValue('detail')}</span>,
    },
    {
      id: 'active',
      header: 'Kích hoạt',
      cell: ({ row }) => <Switch />,
    },
    {
      id: 'actions',
      header: 'Hành Động',

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
