'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useState } from 'react';
import AnimalsTemplate from './components/animalsTemplate';

export default function Page() {
  const [activeTab, setActiveTab] = useState('Vật nuôi mẫu');
  return (
    <>
      <Card>
        <CardHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lí</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Mẫu</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{activeTab}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardHeader>
        <CardContent className='pt-3'>
          <Tabs defaultValue='tasks' className='w-full'>
            <TabsList>
              <TabsTrigger
                value='animalsTemplate'
                className='relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary'
                onClick={() => setActiveTab('Vật nuôi mẫu')}
              >
                <Icon
                  icon='fluent:task-list-ltr-20-filled'
                  className='h-4 w-4 me-1'
                />
                Vật nuôi mẫu
              </TabsTrigger>
              <TabsTrigger
                value='tasksTemplate'
                className='relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary'
                onClick={() => setActiveTab('Công việc mẫu')}
              >
                <Icon icon='carbon:task-star' className='h-4 w-4 me-1' />
                Công việc mẫu
              </TabsTrigger>
              <TabsTrigger
                value='daylyTasks'
                className='relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary'
                onClick={() => setActiveTab('Công việc thường ngày')}
              >
                <Icon icon='hugeicons:task-daily-02' className='h-4 w-4 me-1' />
                Công việc thường ngày
              </TabsTrigger>
            </TabsList>
            <TabsContent value='tasksTemplate'>
              {/* <TaskTemplate /> */}
            </TabsContent>
            <TabsContent value='animalsTemplate'>
              <AnimalsTemplate />
            </TabsContent>
            <TabsContent value='daylyTasks'></TabsContent>
            <TabsContent value='calendarTasks'></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
