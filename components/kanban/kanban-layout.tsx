'use client';
import { useEffect, useState } from 'react';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { useMedicalSymptomQuery } from '@/hooks/use-query';
import { useQueryClient } from '@tanstack/react-query';
import ColumnContainer from './column';
import { Column } from './data';
const KanBanLayout = ({ defaultCols }: { defaultCols: Column[] }) => {
  const queryClient = useQueryClient();
  const DEFAULT_PAGE_SIZE = 20;
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { data: medicalsymptoms } = useMedicalSymptomQuery();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  }, [pageIndex, pageSize]);

  // create task state
  const [open, setOpen] = useState<boolean>(false);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  function onDragStart(event: DragStartEvent) {}
  function onDragEnd(event: DragEndEvent) {
    // setActiveColumn(null);
  }
  function onDragOver(event: DragOverEvent) {}
  return (
    <>
      <div className=''>
        <div className='flex gap-2 mb-5'>
          <div className='flex-1 font-medium  lg:text-2xl text-xl  text-default-900'>
            Bảng báo cáo bệnh tật ở động vật
          </div>
          <div className='flex-none'>{/* <AddBoard /> */}</div>
        </div>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className='flex  gap-4 overflow-x-auto '>
            <div className=' w-full  gap-4 grid md:grid-cols-1 lg:grid-cols-2'>
              {defaultCols.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  tasks={
                    medicalsymptoms?.filter((task) => task.status === col.id) ||
                    []
                  }
                  handleOpenTask={() => setOpen(true)}
                />
              ))}
            </div>
          </div>
        </DndContext>
      </div>
      {/* <CreateTask open={open} setOpen={setOpen} /> */}
    </>
  );
};

export default KanBanLayout;
