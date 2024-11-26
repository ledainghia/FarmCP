'use client';

import { useState } from 'react';

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

export default function BarnTable() {
  const DEFAULT_PAGE_SIZE = 20;
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

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

  // Tạo dữ liệu giả cho các chuồng
  const data = [
    {
      id: 1,
      name: 'Chuồng A',
      detail: 'Chuồng cho bò',
      action: 'Xem chi tiết',
      expandedContent: (
        <>
          <Accordion type='single' collapsible className='w-full '>
            <AccordionItem value='item-1'>
              <AccordionTrigger>Danh sách cảm biến</AccordionTrigger>
              <AccordionContent className=''>
                <SensorsTable hasTitle={false} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
              <AccordionTrigger>Danh sách thiết bị điều khiển</AccordionTrigger>
              <AccordionContent>
                <ControlDevicesTable hasTitle={false} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      ),
    },
    {
      id: 2,
      name: 'Chuồng B',
      detail: 'Chuồng cho gà',
      action: 'Xem chi tiết',
    },
    {
      id: 3,
      name: 'Chuồng C',
      detail: 'Chuồng cho lợn',
      action: 'Xem chi tiết',
    },
    {
      id: 4,
      name: 'Chuồng D',
      detail: 'Chuồng cho cừu',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
    {
      id: 5,
      name: 'Chuồng E',
      detail: 'Chuồng cho ngựa',
      action: 'Xem chi tiết',
    },
  ];

  //split data array for pagination

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
      title='Danh sách chuồng trại'
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
            placeholder='Tìm kiếm theo tên hoặc mã sinh viên'
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button>Thêm mới</Button>
        </div>
      }
    />
  );
}
