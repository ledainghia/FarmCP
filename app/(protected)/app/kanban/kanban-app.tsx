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
const KanBanApp = ({ defaultCols }: { defaultCols: Column[] }) => {
  const queryClient = useQueryClient();
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
      const tasks: Pagination<TaskDTO> = response.data.result;
      return tasks; // Assuming `result` contains the pagination data
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  }, [pageIndex, pageSize]);

  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  useEffect(() => {
    if (todos) {
      const sortedTasks = todos.items.sort((a, b) => {
        if (a.createdAt !== b.createdAt) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        if (a.dueDate !== b.dueDate) {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
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
          <div className='flex-none'>
            <AddBoard />
          </div>
        </div>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className='flex  gap-4 overflow-x-auto no-scrollbar'>
            <div className='flex flex-1 gap-4'>
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
