'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import { MedicalSymptomDTO } from '@/dtos/MedicalSymptomDTO';
import { Column } from './data';
import EmptyTask from './empty';
import TaskCard from './task';

function ColumnContainer({
  column,
  tasks,
}: {
  column: Column;
  tasks: MedicalSymptomDTO[];
  handleOpenTask: () => void;
}) {
  const [deleteColumn, setDeleteColumn] = useState<boolean>(false);

  return (
    <>
      <DeleteConfirmationDialog
        open={deleteColumn}
        onClose={() => setDeleteColumn(false)}
      />

      <Card
        className={cn(
          'flex-1  bg-default-200 shadow-none border app-height flex flex-col relative'
        )}
      >
        <CardHeader className='flex-none bg-card relative rounded-t-md py-4'>
          <div
            className={cn(
              'absolute -start-[1px] top-1/2 -translate-y-1/2 h-[60%] w-3 rounded-r-md',
              {
                'bg-lime-900': column.id === 'Pending',
                'bg-lime-400': column.id === 'Normal',
                'bg-destructive': column.id === 'Diagnosed',
                'bg-success': column.id === 'Prescribed',
              }
            )}
          ></div>
          <div className='flex items-center gap-2'>
            <div className='flex-1 text-center text-lg capitalize text-default-900 font-medium'>
              {column.title} ({tasks.length})
            </div>
          </div>
        </CardHeader>
        <CardContent className='flex-1 pt-6 px-3.5 h-full overflow-y-auto no-scrollbar'>
          {/* Column task container */}
          <div className=' space-y-6'>
            {tasks?.length === 0 && <EmptyTask />}
            {tasks.map((task) => (
              <TaskCard task={task} key={task.id} />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default ColumnContainer;
