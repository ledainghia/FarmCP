'use client';
import { useEffect, useState } from 'react';

import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

import { MedicalSymptomDTO } from '@/dtos/MedicalSymptomDTO';
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
  const [medicalSymptoms, setMedicalSymptoms] = useState<MedicalSymptomDTO[]>(
    []
  );

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

  useEffect(() => {
    setMedicalSymptoms(
      medicalsymptoms?.sort(
        (a, b) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      ) ?? []
    );
  }, [medicalsymptoms]);

  return (
    <>
      <div className=''>
        <div className='flex gap-2 mb-5'>
          <div className='flex-1 font-medium  lg:text-2xl text-xl  text-default-900'>
            Bảng báo cáo bệnh tật ở động vật
          </div>
          <div className='flex-none'>{/* <AddBoard /> */}</div>
        </div>

        <div className='flex  gap-4 overflow-x-auto '>
          <div className=' w-full  gap-4 grid md:grid-cols-1 lg:grid-cols-4'>
            {defaultCols.map((col) => (
              <ColumnContainer
                key={col.id}
                column={col}
                tasks={
                  medicalSymptoms?.filter((task) => task.status === col.id) ||
                  []
                }
                handleOpenTask={() => setOpen(true)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* <CreateTask open={open} setOpen={setOpen} /> */}
    </>
  );
};

export default KanBanLayout;
