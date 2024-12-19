'use client';
import React, { useState, useMemo } from 'react';
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
const KanBanApp = ({
  defaultCols,
  defaultTasks,
}: {
  defaultCols: Column[];
  defaultTasks: Task[];
}) => {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
        tasks[activeIndex].columnId = overId.toString();
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }

    // const isActiveAColumn = active.data.current?.type === 'Column';
    // if (!isActiveAColumn) return;

    // setColumns((columns) => {
    //   const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

    //   const overColumnIndex = columns.findIndex((col) => col.id === overId);

    //   return arrayMove(columns, activeColumnIndex, overColumnIndex);
    // });
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
        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverAColumn = over.data.current?.type === 'Column';
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].columnId = overId.toString();
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
  return (
    <>
      <div className=''>
        <div className='flex gap-2 mb-5'>
          <div className='flex-1 font-medium lg:text-2xl text-xl capitalize text-default-900'>
            titlea
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
          <div className='flex z gap-4 overflow-x-auto no-scrollbar'>
            <div className='flex gap-4'>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
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
