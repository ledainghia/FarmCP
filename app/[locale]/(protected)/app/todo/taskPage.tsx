'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateTodo from './create-todo';
import { todos } from './data';
import { ScrollArea } from '@/components/ui/scroll-area';
import TodoHeader from './todo-header';
import Todo from './todo';
import TodoSidebarWrapper from './sidebar-wrapper';
import Nav from '@/components/nav';
import { useTranslations } from 'next-intl';
import ProgressBlock from '@/components/blocks/progress-block';
import DashboardDropdown from '@/components/dashboard-dropdown';
import DealsDistributionChart from '@/components/project/deals-distribution-chart';
import { Icon } from '@/components/ui/icon';
import { BarChart, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { generateTaskData } from '@/utils/fakeData';
import { cn } from '@/lib/utils';
import { generateDateRange } from '@/utils/generateDateRange';

const actions = [
  {
    value: 'the previous quarter',
    name: 'Get task statistics for the previous quarter',
    icon: 'heroicons-outline:sort-ascending',
  },
  {
    value: 'last month',
    name: 'Get task statistics for last month',
    icon: 'heroicons-outline:sort-ascending',
  },
  {
    value: 'previous year',
    name: 'Get task statistics for the previous year',
    icon: 'heroicons-outline:sort-descending',
  },
  {
    value: 'previous life cycle',
    name: 'Get task statistics in previous life cycle',
    icon: 'heroicons-outline:sort-descending',
  },
];

const TasksPage = () => {
  const t = useTranslations('TodoApp');
  const [statisticsTime, setStatisticsTime] = useState('previous life cycle');
  const [data, setData] = useState(generateTaskData());

  const handleSelect = (value: string) => {
    setStatisticsTime(value);
    setData(generateTaskData());
  };
  return (
    <div className='flex flex-col '>
      <div className='col-span-12 lg:col-span-7 space-y-5 mb-5'>
        <Card>
          <CardContent className='p-5'>
            <div className='flex justify-center align-middle'>
              <div className='block text-sm text-default-600 font-medium  mb-1.5 flex-1 '>
                * Data updated according to {statisticsTime}
              </div>
              <div className=' mb-4'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size='icon'
                      className='w-8 h-8 rounded-sm bg-default-100 group'
                    >
                      <MoreVertical className='w-5 h-5 text-default group-hover:text-default-foreground' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='p-0 rounded-md overflow-hidden'
                  >
                    {actions.map((action, index) => (
                      <DropdownMenuItem
                        key={`action-${index}`}
                        onClick={() => handleSelect(action.value)}
                        className='flex items-center gap-1.5  border-b text-default-600 group focus:bg-default focus:text-primary-foreground rounded-none group'
                      >
                        <Icon
                          icon={action.icon}
                          className='group-hover:text-primary-foreground w-4 h-4'
                        />
                        <span className='text-default-700 group-hover:text-primary-foreground'>
                          {action.name}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className='grid grid-cols-12 gap-3'>
              <div className='col-span-12 grid grid-cols-4 gap-3'>
                <Card className='bg-info/20 shadow-none border-none'>
                  <CardContent className=' p-4  text-center'>
                    <div className='mx-auto h-10 w-10  rounded-full flex items-center justify-center bg-white mb-4'>
                      <BarChart className=' h-6 w-6 text-info' />
                    </div>
                    <div className='block text-sm text-default-600 font-medium  mb-1.5'>
                      Tổng số công việc <br />
                      <span className='text-xs'>( {generateDateRange()} )</span>
                    </div>
                    <div className='text-2xl text-default-900  font-medium'>
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
                    <div className='block text-sm text-default-600 font-medium  mb-1.5'>
                      Công việc đã hủy
                      <br />
                      <span className='text-xs'>( {generateDateRange()} )</span>
                    </div>
                    <div className='text-2xl text-default-900  font-medium'>
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
                    <div className='block text-sm text-default-600 font-medium  mb-1.5'>
                      Công việc đang thực hiện
                    </div>
                    <div className='text-2xl text-default-900  font-medium'>
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
                    <div className='block text-sm text-default-600 font-medium  mb-1.5'>
                      Công việc đã hoàn thành <br />
                      <span className='text-xs'>( {generateDateRange()} )</span>
                    </div>
                    <div className='text-2xl text-default-900  font-medium'>
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
      <div className='flex gap-5  '>
        <TodoSidebarWrapper>
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
                  links={[
                    {
                      title: 'Thấp',
                      active: true,
                    },
                    {
                      title: 'Trung bình',
                      active: false,
                    },
                    {
                      title: 'Cao',
                      active: false,
                    },
                  ]}
                />
                <div className='py-4 px-5 text-default-800  font-semibold text-xs uppercase'>
                  Trạng thái
                </div>
                <Nav
                  dotStyle
                  links={[
                    {
                      title: 'Khởi tạo',
                      active: true,
                    },
                    {
                      title: 'Đang thực hiện',
                      active: false,
                    },
                    {
                      title: 'Nhân viên đã hoàn thành',
                      active: false,
                    },
                    {
                      title: 'Admin đã xác nhận',
                      active: false,
                    },
                    {
                      title: 'Admin đã từ chối xác nhận',
                      active: false,
                    },
                  ]}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </TodoSidebarWrapper>
        <div className='flex-1 w-full'>
          <Card className='h-full overflow-hidden'>
            <CardHeader className='border-b border-default-200 '>
              <TodoHeader />
            </CardHeader>
            <CardContent className='p-0 h-full'>
              <div className='h-[calc(100%-60px)] overflow-y-auto no-scrollbar'>
                {todos.map((todo, index) => (
                  <Todo key={`todo-${index}`} todo={todo} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
