'use client';
import { useEffect, useState } from 'react';

import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { vi } from 'date-fns/locale';
import { MedicalSymptomDTO } from '@/dtos/MedicalSymptomDTO';
import { useMedicalSymptomQuery } from '@/hooks/use-query';
import { useQueryClient } from '@tanstack/react-query';
import ColumnContainer from './column';
import { Column } from './data';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon, Search } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { DateRange } from 'react-day-picker';
import { addMonths } from 'date-fns';
import { Input } from '../ui/input';
import { InputIcon } from '../ui/input-icon';

const KanBanLayout = ({ defaultCols }: { defaultCols: Column[] }) => {
  const queryClient = useQueryClient();
  const DEFAULT_PAGE_SIZE = 20;
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { data: medicalsymptoms } = useMedicalSymptomQuery();
  const [medicalSymptoms, setMedicalSymptoms] = useState<MedicalSymptomDTO[]>(
    []
  );
  const [date, setDate] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -1), // Lấy thời điểm hiện tại trừ đi 1 tháng
    to: new Date(), // Lấy thời điểm hiện tại
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['medicalSymptom'] });
  }, [pageIndex, pageSize]);

  // create task state
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const convertToVietnamTime = (date: Date) => {
      const vietnamOffset = 7 * 60; // Vietnam is UTC+7
      const utcOffset = date.getTimezoneOffset();
      return new Date(date.getTime() + (vietnamOffset + utcOffset) * 60000);
    };

    setMedicalSymptoms(
      (
        medicalsymptoms?.sort(
          (a, b) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        ) ?? []
      )
        .filter((item) => {
          const itemDate = new Date(item.createAt).getTime();
          const fromDate = date?.from
            ? convertToVietnamTime(date.from).getTime()
            : 0;
          const toDate = date?.to ? convertToVietnamTime(date.to).getTime() : 0;
          return itemDate >= fromDate && itemDate <= toDate;
        })
        .filter((item) => {
          return (
            item.nameAnimal.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
          );
        })
    );
  }, [medicalsymptoms, date, searchQuery]);

  return (
    <>
      <div className=''>
        <div className='flex gap-2 mb-5'>
          <div className='flex-1 font-medium  lg:text-2xl text-xl  text-default-900'>
            Bảng báo cáo bệnh tật ở động vật
          </div>
          <div className='flex gap-2'>
            <Popover>
              <PopoverTrigger asChild>
                <Button id='date' variant={'outline'} className={cn()}>
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
            <div className='h-full w-[400px]'>
              <InputIcon
                endIcon={Search}
                className='h-full'
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Tìm kiếm báo cáo bệnh theo tên hoặc theo triệu chứng '
              />
            </div>
          </div>
        </div>

        <div className='flex  gap-4 overflow-x-auto '>
          <div className=' w-full  gap-2 grid md:grid-cols-1 lg:grid-cols-3'>
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
