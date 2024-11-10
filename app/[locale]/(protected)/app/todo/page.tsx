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
import TasksPage from './taskPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskTemplate from './tasks-template/page';

const Page = () => {
  const t = useTranslations('TodoApp');

  return (
    <>
      <Card>
        <CardContent className='pt-3'>
          <Tabs defaultValue='home' className='w-full'>
            <TabsList>
              <TabsTrigger
                value='tasksTemplate'
                className='relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary'
              >
                <Icon icon='heroicons:home' className='h-4 w-4 me-1' />
                Công việc mẫu
              </TabsTrigger>
              <TabsTrigger
                value='tasks'
                className='relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary'
              >
                <Icon icon='heroicons:user' className='h-4 w-4 me-1' />
                Công việc
              </TabsTrigger>
              <TabsTrigger
                value='daylyTasks'
                className='relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary'
              >
                <Icon
                  icon='heroicons:chat-bubble-left-right'
                  className='h-4 w-4 me-1'
                />
                Công việc thường ngày
              </TabsTrigger>
            </TabsList>
            <TabsContent value='tasksTemplate'>
              <TaskTemplate />
            </TabsContent>
            <TabsContent value='tasks'>
              <TasksPage />
            </TabsContent>
            <TabsContent value='daylyTasks'>
              Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt
              qui
            </TabsContent>
            <TabsContent value='settings'>
              Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt
              qui esse pariatur duis deserunt mollit dolore cillum minim tempor
              enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut
              voluptate aute id deserunt nisi.
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
