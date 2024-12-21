'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { vi } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { generateTaskData } from '@/utils/fakeData';
import { addMonths, format } from 'date-fns';
import { BarChart, CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { tasksApi } from '@/config/api';
import { TaskDTO } from '@/dtos/AplicationDTO';
import { FilterDTO } from '@/dtos/FilterDTO';
import { Pagination as PaginationType } from '@/dtos/Pagination';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import KanBanApp from '../kanban/kanban-app';
import { defaultCols } from '../kanban/data';

const TasksPage = () => {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -1), // Lấy thời điểm hiện tại trừ đi 1 tháng
    to: new Date(), // Lấy thời điểm hiện tại
  });
  const [status, setStatus] = useState<string>('');

  const data = generateTaskData();
  const DEFAULT_PAGE_SIZE = 20;
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { data: todos } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const filter: FilterDTO = {
        PageSize: pageSize,
        PageNumber: pageIndex,
      };
      const response = await tasksApi.getTasks(filter); // API call
      const tasks: PaginationType<TaskDTO> = response.data.result;
      return tasks; // Assuming `result` contains the pagination data
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  }, [pageIndex, pageSize]);
  const [priorityNums, setPriorityNums] = useState<number[]>([]);

  useEffect(() => {
    if (todos && todos.items) {
      const uniquePriorityNums = todos?.items
        ? Array.from(new Set(todos.items.map((todo) => todo.priorityNum)))
        : [];
      setPriorityNums(uniquePriorityNums);
    }
  }, [todos]);

  return (
    <div className='flex flex-col '>
      <div className='col-span-12 lg:col-span-7 space-y-5 mb-5'>
        <Card>
          <CardContent className='p-5'>
            <div className='flex justify-center items-center mb-3'>
              <div className='block text-sm text-default-600 font-medium   flex-1 '>
                * Thống kê số lượng công việc theo thời gian từ{' '}
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'dd/MM/yyyy', { locale: vi })} đến{' '}
                      {format(date.to, 'dd/MM/yyyy', { locale: vi })}
                    </>
                  ) : (
                    format(date.from, 'dd/MM/yyyy')
                  )
                ) : (
                  <span>Chọn khoảng ngày thống kê</span>
                )}
              </div>
              <div className=' '>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id='date'
                      variant={'outline'}
                      size='icon'
                      className={cn()}
                    >
                      <CalendarIcon className='w-4 h-4' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='end'>
                    <Calendar
                      initialFocus
                      mode='range'
                      locale={vi}
                      classNames={{
                        months:
                          'w-full  space-y-4 sm:gap-x-4 sm:space-y-0 flex',
                      }}
                      className='flex flex-row'
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className='grid grid-cols-12 gap-3'>
              <div className='col-span-12 grid grid-cols-4 gap-3'>
                <Card className='bg-info/20 shadow-none border-none'>
                  <CardContent className=' p-4  text-center'>
                    <div className='mx-auto h-10 w-10  rounded-full flex items-center justify-center bg-white mb-4'>
                      <BarChart className=' h-6 w-6 text-info' />
                    </div>
                    <div className='block text-base text-default-600 font-bold  mb-1.5'>
                      Tổng số công việc
                    </div>
                    <div className='text-2xl text-default-900  font-bold'>
                      {data.totalTasks}
                      <span
                        className={cn(
                          'text-xs ml-1 text-destructive',
                          data.changeTotalTasks < 0
                            ? 'text-destructive'
                            : 'text-success'
                        )}
                      >
                        {data.changeTotalTasks > 0
                          ? `↑ ${data.changeTotalTasks}`
                          : `↓ ${-1 * data.changeTotalTasks}`}{' '}
                        so với cùng kì năm trước
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className='bg-warning/20 shadow-none border-none'>
                  <CardContent className=' p-4  text-center'>
                    <div className='mx-auto h-10 w-10  rounded-full flex items-center justify-center bg-white mb-4'>
                      <Icon
                        className='w-6 h-6 text-warning'
                        icon='heroicons:chart-pie'
                      />
                    </div>
                    <div className='block text-base text-default-600 font-bold  mb-1.5'>
                      Công việc đã hủy
                    </div>
                    <div className='text-2xl text-default-900  font-bold'>
                      {data.tasksCancelled}
                      <span
                        className={cn(
                          'text-xs ml-1 text-destructive',
                          data.tasksCancelled < 0
                            ? 'text-destructive'
                            : 'text-success'
                        )}
                      >
                        {data.tasksCancelled > 0
                          ? `↑ ${data.tasksCancelled}`
                          : `↓ ${-1 * data.tasksCancelled}`}{' '}
                        so với cùng kì năm trước
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className='bg-success/20 shadow-none border-none'>
                  <CardContent className='p-4 text-center'>
                    <div className='mx-auto h-10 w-10  rounded-full flex items-center justify-center bg-white mb-4'>
                      <Icon
                        className='w-6 h-6 text-success'
                        icon='heroicons:calculator'
                      />
                    </div>
                    <div className='block text-base text-default-600 font-bold  mb-1.5'>
                      Công việc đang thực hiện
                    </div>
                    <div className='text-2xl text-default-900  font-bold'>
                      {data.tasksPending}
                    </div>
                  </CardContent>
                </Card>
                <Card className='bg-primary/20 shadow-none border-none'>
                  <CardContent className=' p-4  text-center'>
                    <div className='mx-auto h-10 w-10  rounded-full flex items-center justify-center bg-white mb-4'>
                      <Icon
                        className='w-6 h-6 text-primary'
                        icon='heroicons:clock'
                      />
                    </div>
                    <div className='block text-base text-default-600 font-bold  mb-1.5'>
                      Công việc đã hoàn thành
                    </div>
                    <div className='text-2xl text-default-900  font-bold'>
                      {data.tasksCompleted}
                      <span
                        className={cn(
                          'text-xs ml-1 text-destructive',
                          data.tasksCompleted < 0
                            ? 'text-destructive'
                            : 'text-success'
                        )}
                      >
                        {data.tasksCompleted > 0
                          ? `↑ ${data.tasksCompleted}`
                          : `↓ ${-1 * data.tasksCompleted}`}{' '}
                        so với cùng kì năm trước
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='flex col-span-12 gap-5  '>
        {/* <TodoSidebarWrapper>
          <Card className='h-full'>
            <CardContent className='h-full p-0'>
              <ScrollArea className='h-[calc(100%-30px)]'>
                <div className='mb-4 px-4 pt-5 m-1 sticky top-0'>
                  <CreateTodo />
                </div>
                <Nav
                  links={[
                    {
                      title: 'Danh sách công việc',
                      icon: 'hugeicons:task-01',
                      active: true,
                    },
                    {
                      title: 'Khởi tạo',
                      icon: 'heroicons:star',
                      active: false,
                    },
                    {
                      title: 'Đang thực hiện',
                      icon: 'carbon:in-progress',
                      active: false,
                    },
                    {
                      title: 'Hoàn thành',
                      icon: 'heroicons:document-check',
                      active: false,
                    },
                    {
                      title: 'Đã hủy',
                      icon: 'heroicons:trash',
                      active: false,
                    },
                  ]}
                />
                <div className='py-4 px-5 text-default-800  font-semibold text-xs uppercase'>
                  Mức độ ưu tiên
                </div>
                <Nav
                  dotStyle
                  links={priorityNums.map((priorityNum) => ({
                    title: `Mức ${priorityNum}`,
                    active: true,
                  }))}
                />
                
              </ScrollArea>
            </CardContent>
          </Card>
        </TodoSidebarWrapper>
        <div className='flex-1 w-full'>
          <Card className='h-full overflow-hidden'>
            {todos && Array.isArray(todos.items) && todos.items.length > 0 && (
              <CardHeader className='border-b border-default-200 '>
                <TodoHeader />
              </CardHeader>
            )}

            {!todos ||
              (Array.isArray(todos.items) && todos.items.length === 0 && (
                <div className='flex flex-col items-center justify-center align-middle h-full bg-gray-100'>
                  <Icon
                    icon='oui:cross-in-circle-empty'
                    className='text-5xl text-gray-500 mb-4'
                  ></Icon>
                  <p className='text-lg font-bold text-gray-500'>
                    Không có dữ liệu
                  </p>
                </div>
              ))}

            <CardContent className='p-0 h-full'>
              <div className='h-[calc(100%-60px)] overflow-y-scroll '>
                {todos &&
                  Array.isArray(todos.items) &&
                  todos.items.map((todo, index) => (
                    <Todo key={`todo-${index}`} todo={todo} />
                  ))}

                {todos &&
                  Array.isArray(todos.items) &&
                  todos.items.length > 0 && (
                    <TablePagination
                      hasNextPage={todos.hasNextPage}
                      hasPreviousPage={todos.hasPreviousPage}
                      pageIndex={pageIndex}
                      pageSize={pageSize}
                      setPageIndex={setPageIndex}
                      setPageSize={setPageSize}
                      totalItems={todos.totalItems}
                      totalPages={todos.totalPages}
                    />
                  )}
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
      <KanBanApp defaultCols={defaultCols} />
    </div>
  );
};

export default TasksPage;
