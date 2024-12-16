'use client';

import {
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import TablePagination from '@/app/(protected)/table/react-table/example2/table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Icon } from '../ui/icon';

export type TableProps = {
  data: any[];
  columns: any[];
  isLoading?: boolean;
  title: string;
  header?: React.ReactNode;
  overflow?: boolean;
  pageSize?: number;
  pageIndex?: number;
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  setCurrentPage?: (currentPage: number) => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  setPageSize?: (pageSize: number) => void;
  setPageIndex?: (pageIndex: number) => void;
};

const TableCustom = ({
  hasNextPage,
  hasPreviousPage,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  totalItems,
  totalPages,
  data,
  columns,
  isLoading,
  title,
  header,
  overflow,
}: TableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [expanded, setExpanded] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      expanded,
      rowSelection,
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getExpandedRowModel: getExpandedRowModel(),
  });
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  return (
    <div className='w-full'>
      <div className='flex items-center py-4 '>
        <div
          className={cn(
            'flex-1  font-normal text-default-900',
            !isDesktop ? 'text-sm' : 'text-base'
          )}
        >
          {title}
        </div>
        <div>{header}</div>
      </div>

      <Table>
        <TableHeader className='bg-lime-50'>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={cn(
                    (header.id === 'select' || header.id === 'actions') &&
                      'w-10'
                  )}
                >
                  {!header.isPlaceholder && (
                    <div className='flex items-center gap-1 font-bold text-sm'>
                      {/* Label */}
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {/* Icon */}
                      {{
                        asc: (
                          <Icon icon='fa-solid:sort-up' className='text-sm' />
                        ),
                        desc: (
                          <Icon icon='fa-solid:sort-down' className='text-sm' />
                        ),
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className={cn(overflow && 'overflow-scroll')}>
          {!isLoading &&
          table.getRowModel() &&
          table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  className={cn(
                    'cursor-pointer',
                    (row.id === 'select' || row.id === 'actions') &&
                      'justify-center items-center'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className=' p-4'>
                      {row.original.expandedContent}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='h-24 text-center p-4'
              >
                <div className='flex flex-col items-center justify-center align-middle h-full '>
                  <Icon
                    icon='oui:cross-in-circle-empty'
                    className='text-5xl text-gray-500 mb-4'
                  ></Icon>
                  <p className='text-lg font-bold text-gray-500'>
                    Không có dữ liệu
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pageIndex &&
      pageSize &&
      totalItems &&
      totalPages &&
      hasNextPage !== undefined &&
      hasPreviousPage !== undefined &&
      setPageSize &&
      setPageIndex ? (
        <TablePagination
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          totalItems={totalItems}
          totalPages={totalPages}
        />
      ) : null}
    </div>
  );
};

export default TableCustom;
