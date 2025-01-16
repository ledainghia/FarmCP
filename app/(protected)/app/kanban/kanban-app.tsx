'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { type Column, type Task } from './data';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import ColumnContainer from './column';
import TaskCard from './task';
import { createPortal } from 'react-dom';
import AddBoard from './add-board';
import CreateTask from './create-task';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FilterDTO } from '@/dtos/FilterDTO';
import { tasksApi } from '@/config/api';
import { TaskDTO } from '@/dtos/AplicationDTO';
import { Pagination } from '@/dtos/Pagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Search } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { vi } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { addDays, addMonths, subDays } from 'date-fns';
import { Input } from '@/components/ui/input';
import { InputIcon } from '@/components/ui/input-icon';

const KanBanApp = ({ defaultCols }: { defaultCols: Column[] }) => {
  const queryClient = useQueryClient();
  const DEFAULT_PAGE_SIZE = 10000;
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 2), // Lấy thời điểm hiện tại trừ đi 2 ngày
    to: addDays(new Date(), 1), // Lấy thời điểm của ngày mai (ngày mốt)
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { data: todos } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const filter: any = {
        PageSize: pageSize,
        PageNumber: pageIndex,
        TaskName: searchQuery,
        DueDateFrom: date?.from ? new Date(date.from).toISOString() : undefined,
        DueDateTo: date?.to ? new Date(date.to).toISOString() : undefined,
      };
      const response = await tasksApi.getTasks(filter); // API call
      const tasks: Pagination<TaskDTO> = response.data.result;
      return tasks; // Assuming `result` contains the pagination data
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  }, [pageIndex, pageSize, searchQuery, date]);

  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  useEffect(() => {
    if (todos) {
      const sortedTasks = todos.items.sort((a, b) => {
        // if (a.createdAt !== b.createdAt) {
        //   return (
        //     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        //   );
        // }
        // if (a.dueDate !== b.dueDate) {
        //   return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        // }
        return a.priorityNum - b.priorityNum;
      });
      setTasks(sortedTasks);
    }
  }, [todos]);

  const [activeTask, setActiveTask] = useState<TaskDTO | null>(null);

  // create task state
  const [open, setOpen] = useState<boolean>(false);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  function onDragStart(event: DragStartEvent) {
    // if (event.active.data.current?.type === 'Column') {
    //   setActiveColumn(event.active.data.current.column);
    //   return;
    // }

    if (event.active.data.current?.type === 'Task') {
      console.log('DRAG START', event.active.data.current);
      setActiveTask(event.active.data.current.task);
      return;
    }
  }
  function onDragEnd(event: DragEndEvent) {
    // setActiveColumn(null);
    setActiveTask(null);

    // console.log('DRAG END');
    const { active, over } = event;
    console.log(event);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        console.log('DRAG END', tasks);
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === 'Column';
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].id = overId.toString();
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
  function onDragOver(event: DragOverEvent) {
    console.log('DRAG OVER');
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';
    if (!isActiveATask) return;
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        if (tasks[activeIndex].status != tasks[overIndex].status) {
          tasks[activeIndex].status = tasks[overIndex].status;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverAColumn = over.data.current?.type === 'Column';
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].status = overId.toString();
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  return (
    <>
      <div className=''>
        <div className='flex gap-2 mb-5'>
          <div className='flex-1 font-medium lg:text-2xl text-xl capitalize text-default-900'>
            Danh sách công việc
          </div>
          <div className='flex gap-2'>
            <Popover>
              <PopoverTrigger asChild>
                <Button id='date' variant={'outline'} className='h-full'>
                  {date
                    ? `${date.from?.toLocaleDateString()} - ${date.to?.toLocaleDateString()}`
                    : 'Chọn ngày'}
                  <CalendarIcon className='ml-3 w-4 h-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='end'>
                <Calendar
                  initialFocus
                  mode='range'
                  locale={vi}
                  classNames={{
                    months: 'w-full  space-y-4 sm:gap-x-4 sm:space-y-0 flex',
                  }}
                  className='flex flex-row'
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <div className='h-12 w-[200px]'>
              <InputIcon
                endIcon={Search}
                className='h-12'
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Tìm kiếm công việc'
              ></InputIcon>
            </div>
            <AddBoard />
          </div>
        </div>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className='flex  gap-4 overflow-x-auto '>
            <div className=' w-full gap-4 grid md:grid-cols-1  lg:grid-cols-2 2xl:grid-cols-4'>
              {defaultCols.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  tasks={tasks.filter((task) => task.status === col.id)}
                  handleOpenTask={() => setOpen(true)}
                />
              ))}
            </div>
          </div>

          {createPortal(
            <DragOverlay>
              {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
      <CreateTask open={open} setOpen={setOpen} />
    </>
  );
};

export default KanBanApp;
