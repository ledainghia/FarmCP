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
import { useAnimalsTemplatesQuery, useCagesQuery } from '@/hooks/use-query';
import { DataProps } from '@/type_define/dataProps';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, SquarePen, Trash2 } from 'lucide-react';
import GrowStageTemplates from './growStageTemplate';
import { AnimalsTemplateDTO } from '@/dtos/AnimalsTemplateDTO';
import AnimalsTemplateDialog from './animalsTemplateDialog';

export default function AnimalsTemplate({
  addNew = true,
}: {
  addNew?: boolean;
}) {
  const DEFAULT_PAGE_SIZE = 20;
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [animalsTemplatesList, setAnimalsTemplatesList] = useState<any[]>([]);
  const { data: animalsTemplates } = useAnimalsTemplatesQuery();

  useEffect(() => {
    if (animalsTemplates) {
      const updatedItems = animalsTemplates.items.map(
        (item: AnimalsTemplateDTO) => ({
          ...item, // Giữ nguyên các thuộc tính của object
          expandedContent: (
            <GrowStageTemplates animalID={item.id} animalName={item.name} />
          ), // Thêm ReactNode
        })
      );
      setAnimalsTemplatesList(updatedItems);
    }
  }, [animalsTemplates]);

  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      size: 3,
      cell: ({ row }) => (
        <div className=''>
          <Button
            variant={'ghost'}
            size='icon'
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
      accessorKey: 'species',
      header: 'Loại động vật',
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
    },
    {
      accessorKey: 'defaultCapacity',
      header: 'Số lượng mặc định',
      meta: 'end',
      cell: ({ row }) => <span>{row.getValue('defaultCapacity')} con</span>,
    },
    { accessorKey: 'notes', header: 'Ghi chú' },
    {
      id: 'actions',
      header: 'Hành Động',
      meta: 'center',

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
      data={animalsTemplatesList}
      columns={columns}
      title='Danh sách vật nuôi mẫu'
      pageSize={animalsTemplates?.pageSize}
      pageIndex={animalsTemplates?.currentPage}
      totalItems={animalsTemplates?.totalItems}
      totalPages={animalsTemplates?.totalPages}
      hasNextPage={animalsTemplates?.hasNextPage}
      hasPreviousPage={animalsTemplates?.hasPreviousPage}
      setPageSize={setPageSize}
      setPageIndex={setPageIndex}
      header={
        <div className='flex gap-2 w-full'>
          <Input
            className='w-[400px] h-full'
            placeholder=''
            onChange={(e) => setSearch(e.target.value)}
          />
          {addNew && <AnimalsTemplateDialog />}
        </div>
      }
    />
  );
}
