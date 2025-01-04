'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CageDTO } from '@/dtos/CageDTO';
import { MedicalSymptomDTO } from '@/dtos/MedicalSymptomDTO';
import { useCagesQuery, useMedicationQuery } from '@/hooks/use-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import Image from 'next/image';
import { use, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Checkbox } from '../ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Icon } from '../ui/icon';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

import { Textarea } from '../ui/textarea';

import AddMedication from '@/app/(protected)/app/bac_si/benh_tat/components/addMedication';
import StepProgressBar from '../ui/steps';
import StepsProgress from '@/app/(protected)/app/bac_si/benh_tat/components/stepsProgress';
import { m } from 'framer-motion';
const formSchema = z
  .object({
    isSeperatorCage: z.boolean().optional(),
    cageId: z.string().optional(),
    notes: z.string().optional(),
    daysToTake: z.number().min(1),
    quantityAnimal: z.number().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.isSeperatorCage) {
      if (!data.cageId || data.cageId === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cageId'],
          message: 'Vui lòng chọn chuồng',
        });
      }
    }
  });

const formSchema2 = z.object({
  id: z.number(),
  medicationId: z.string(),
  dosage: z.number().min(0),
  sessions: z.array(z.string()).min(1, { message: 'Hãy chọn ít nhất 1 buổi' }),
});

function TaskCard({ task }: { task: MedicalSymptomDTO }) {
  const [open, setOpen] = useState<boolean>(false);
  const [stepCurrent, setStepCurrent] = useState<number>(1);

  const [isSeperatorCage, setIsSeperatorCage] = useState<boolean>(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: true,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const addMedicationRef = useRef<{
    submitAll: () => void;
    getValidValues: () => [];
  }>(null);
  const addMedicationSCRef = useRef<{
    submitAll: () => void;
    getValidValues: () => [];
  }>(null);

  const [numberOfMedication, setNumberOfMedication] = useState<number>(0);
  const [numberOfMedicationSC, setNumberOfMedicationSC] = useState<number>(0);

  const { data: cases } = useCagesQuery();
  const { data: medications } = useMedicationQuery();

  const [baseDataInput, setBaseDataInput] =
    useState<z.infer<typeof formSchema>>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isSeperatorCage: false,
    },
  });

  const [medicationDataOfCage, setMedicationDataOfCage] = useState<
    z.infer<typeof formSchema2>[]
  >([]);
  const [medicationDataOfSeperatorCage, setMedicationDataOfSeperatorCage] =
    useState<z.infer<typeof formSchema2>[]>([]);

  const formDataRef = useRef<{ [key: number]: any }>({}); // Lưu dữ liệu form trực tiếp

  const submitMedication = () => {};
  const handleNext = () => {
    if (stepCurrent === 1) {
      submitButtonRef.current?.click();
      return;
    } else if (stepCurrent === 2) {
      addMedicationRef.current?.submitAll();
      const numberOfValidMedication =
        addMedicationRef.current?.getValidValues().length;

      if (numberOfValidMedication === numberOfMedication) {
        setStepCurrent(stepCurrent + 1);
      }
      return;
    } else if (stepCurrent === 3 && isSeperatorCage) {
      addMedicationSCRef.current?.submitAll();
      const numberOfValidMedication =
        addMedicationSCRef.current?.getValidValues().length;

      if (numberOfValidMedication === numberOfMedicationSC) {
        setStepCurrent(stepCurrent + 1);
      }
      return;
    }

    setStepCurrent(stepCurrent + 1);
  };

  useEffect(() => {
    console.log('numberOfMedication change ', numberOfMedication);
  }, [numberOfMedication]);

  const handlePrev = () => {
    setStepCurrent(stepCurrent - 1);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      setBaseDataInput(values);
      toast(
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
      setStepCurrent(stepCurrent + 1);
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  const [steps, setSteps] = useState([
    { label: 'Thông tin cơ bản', index: 1 },
    { label: 'Chọn thuốc', index: 2 },
    { label: 'Kiểm tra lại đơn thuốc', index: 3 },
  ]);

  useEffect(() => {
    if (!!!isSeperatorCage) {
      setSteps([
        { label: 'Thông tin cơ bản', index: 1 },
        { label: 'Chọn thuốc', index: 2 },
        { label: 'Kiểm tra lại đơn thuốc', index: 3 },
      ]);
    } else {
      setSteps([
        { label: 'Thông tin cơ bản', index: 1 },
        { label: 'Chọn thuốc cho chuồng bị bệnh', index: 2 },
        { label: 'Chọn thuốc cho chuồng cách ly', index: 3 },
        { label: 'Kiểm tra lại đơn thuốc', index: 4 },
      ]);
    }
  }, [isSeperatorCage]);

  return (
    <>
      {/* <DeleteConfirmationDialog open={open} onClose={() => setOpen(false)} /> */}
      {/* <EditTask open={editTaskOpen} setOpen={setEditTaskOpen} /> */}

      <Dialog
        open={open}
        key={task.id + '-dialogTask'}
        onOpenChange={(e) => {
          setOpen(e);
        }}
      >
        <DialogTrigger asChild>
          <Card
            className={cn('', {
              'opacity-10 bg-primary/50 ': isDragging,
            })}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
          >
            <CardHeader className='flex-row gap-1 p-2.5 items-center space-y-0'>
              {/* <Avatar className="flex-none h-8 w-8 rounded bg-default-200 text-default hover:bg-default-200">
                        <AvatarImage src={projectLogo} />
                        <AvatarFallback className="uppercase">  {title.charAt(0) + title.charAt(1)}</AvatarFallback>
                    </Avatar> */}
              <h3 className='flex-1 text-default-800 text-lg font-medium truncate text-center  '>
                Bệnh ở {task.nameAnimal}
              </h3>
            </CardHeader>
            <CardContent className='p-2.5 pt-1'>
              <div className='flex-col gap-2 '>
                <div className=' text-default-400 mb-1'>Triệu chứng</div>
                <div className='text-default-600 '>{task.symptoms}</div>
              </div>

              <div className='flex gap-2 mt-2'>
                <div>
                  <div className=' text-default-400 mb-1'>Ngày khởi tạo</div>
                  <div className=' text-default-600  font-medium'>
                    12/12/2025
                  </div>
                </div>
                <Separator
                  orientation='vertical'
                  className='text-default-200 h-12'
                />
                <div>
                  <div className=' text-default-400 mb-1'>
                    Số lượng vật nuôi ảnh hưởng
                  </div>
                  <div className=' text-default-600  font-medium'>
                    {task.affectedQuantity} / {task.quantity}
                  </div>
                </div>
              </div>

              <div className='flex-col gap-2 mt-2'>
                <div className=' text-default-400 mb-1'>Ghi chú</div>
                <div className='text-default-600 '>{task.notes}</div>
              </div>
              <div className='mt-1'>
                <div className='text-end text-xs text-default-600 mb-1.5 font-medium'>
                  {/* {progress}% */}
                </div>
                {/* <Progress value={progress} color='primary' size='sm' /> */}
              </div>
              {task.pictures ? (
                <div className='flex mt-5'>
                  <div className='flex-1'>
                    <div className='text-default-400   font-normal mb-3'>
                      Hình ảnh bệnh
                    </div>
                  </div>
                </div>
              ) : null}
              <div className='flex mt-5'>
                <div className='flex-1'>
                  <div className='text-default-400   font-normal mb-3'>
                    Hình ảnh thực tế
                  </div>
                  <div className='w-full grid grid-cols-6 gap-3'>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index + 'Images'}
                        className='relative group w-full'
                      >
                        <Image
                          src='https://images.unsplash.com/photo-1523569467793-70cfeec01d58?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                          width={500}
                          height={500}
                          className='w-full rounded-lg'
                          alt='Picture of the author'
                        />

                        <Dialog>
                          <DialogTrigger asChild>
                            <div className='absolute rounded-lg inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-300'>
                              <div className='flex flex-col justify-center items-center gap-1'>
                                <Icon
                                  icon={'lets-icons:full-alt'}
                                  className='h-6 w-6'
                                />
                                <span className='text-sm font-medium'>
                                  Phóng to ảnh
                                </span>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className='p-0' size='lg'>
                            <DialogHeader>
                              <Image
                                src='https://images.unsplash.com/photo-1523569467793-70cfeec01d58?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                width={500}
                                height={500}
                                className='w-full h-[90vh] rounded-lg object-contain'
                                alt='Picture of the author'
                              />
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent size='lg'>
          <DialogHeader>
            <DialogTitle>Phương án chữa bệnh cho {task.nameAnimal}</DialogTitle>
            <DialogDescription>
              Hãy điền đầy đủ các ô nhập phía dưới rồi bấm nút lưu để lưu lại
              thông tin
            </DialogDescription>
          </DialogHeader>
          <h2>Current Step {stepCurrent}</h2>
          <StepsProgress steps={steps} currentStep={stepCurrent} />
          <div className={stepCurrent === 1 ? '' : 'hidden'}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-3  py-5'
              >
                <FormField
                  control={form.control}
                  name='isSeperatorCage'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(e) => {
                            field.onChange(e);
                            setIsSeperatorCage(e ? true : false);
                          }}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>
                          Tách động vật bị bệnh ra chuồng khác
                        </FormLabel>

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {isSeperatorCage ? (
                  <FormField
                    control={form.control}
                    name='cageId'
                    render={({ field }) => (
                      <FormItem className='flex flex-col w-full'>
                        <FormLabel required={true}>Chọn chuồng</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='checkbox'
                                size='md'
                                className={cn(
                                  '!px-3 ',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                <span className='flex flex-1'>
                                  {cases
                                    ? cases.items.find(
                                        (language) =>
                                          language.id === field.value
                                      )?.name || 'Chọn chuồng'
                                    : 'Chọn chuồng'}
                                </span>
                                <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className={cn(`w-[43vw] p-0`)}>
                            <Command>
                              <CommandInput placeholder='Tìm kiếm chuồng...' />
                              <CommandList>
                                <CommandEmpty>
                                  Không tìm thấy chuồng
                                </CommandEmpty>
                                <CommandGroup>
                                  {cases?.items.map((cage) => (
                                    <CommandItem
                                      value={cage.name}
                                      key={cage.id}
                                      onSelect={() => {
                                        form.setValue('cageId', cage.id);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          cage.id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {cage.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}

                <FormField
                  control={form.control}
                  name='notes'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea placeholder='' {...field} />
                      </FormControl>
                      <FormDescription>Nhập ghi chú nếu có</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-12 gap-4'>
                  <div className='col-span-6'>
                    <FormField
                      control={form.control}
                      name='daysToTake'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số ngày thuốc</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='1'
                              type='number'
                              {...field}
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Nhập số ngày thuốc cho vật nuôi
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='col-span-6'>
                    <FormField
                      control={form.control}
                      name='quantityAnimal'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số lượng vật nuôi dùng thuốc</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='1'
                              type='number'
                              {...field}
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Nhập số lượng vật nuôi dùng thuốc
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className='flex justify-end gap-2 navigation'>
                  <Button
                    ref={submitButtonRef}
                    className='hidden'
                    type='submit'
                  >
                    Tiếp tục
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <AddMedication
            ref={addMedicationRef}
            setNumberOfMedication={setNumberOfMedication}
            numberOfMedication={numberOfMedication}
            setValues={setMedicationDataOfCage}
            className={stepCurrent === 2 ? '' : 'hidden'}
          />
          {isSeperatorCage ? (
            <AddMedication
              setNumberOfMedication={setNumberOfMedicationSC}
              numberOfMedication={numberOfMedicationSC}
              ref={addMedicationSCRef}
              setValues={setMedicationDataOfSeperatorCage}
              className={
                stepCurrent === 2 && !isSeperatorCage
                  ? ''
                  : stepCurrent === 3 && isSeperatorCage
                  ? ''
                  : 'hidden'
              }
            />
          ) : null}

          <div
            className={
              stepCurrent === 3 && !isSeperatorCage
                ? ''
                : stepCurrent === 4 && isSeperatorCage
                ? ''
                : 'hidden'
            }
          >
            <span className='flex items-center'>
              <span className='pr-3 font-bold'>Thông tin cơ bản</span>
              <span className='h-px flex-1 bg-black'></span>
            </span>

            <div className='flow-root rounded-lg border border-gray-100 py-3 shadow-sm mt-3'>
              <dl className='-my-3 divide-y divide-gray-100 text-sm'>
                <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                  <dt className='font-medium text-gray-900'>Tách chuồng</dt>
                  <dd className='text-gray-700 sm:col-span-2'>
                    {baseDataInput?.isSeperatorCage === true ? 'Có' : 'Không'}
                  </dd>
                </div>
                <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                  <dt className='font-medium text-gray-900'>Chuồng tách</dt>
                  <dd className='text-gray-700 sm:col-span-2'>
                    {
                      cases?.items.filter(
                        (item: CageDTO) => item.id === baseDataInput?.cageId
                      )[0]?.name
                    }
                  </dd>
                </div>

                <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                  <dt className='font-medium text-gray-900'>
                    Số ngày dùng thuốc{' '}
                  </dt>
                  <dd className='text-gray-700 sm:col-span-2'>
                    {baseDataInput?.daysToTake} ngày
                  </dd>
                </div>

                <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                  <dt className='font-medium text-gray-900'>
                    Số lượng vật nuôi dùng thuốc{' '}
                  </dt>
                  <dd className='text-gray-700 sm:col-span-2'>
                    {baseDataInput?.quantityAnimal} con
                  </dd>
                </div>
                <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                  <dt className='font-medium text-gray-900'>Ghi chú </dt>
                  <dd className='text-gray-700 sm:col-span-2'>
                    {baseDataInput?.notes}
                  </dd>
                </div>
              </dl>
            </div>

            <span className='flex items-center mt-3'>
              <span className='pr-3 font-bold'>
                Đơn thuốc ({medicationDataOfCage.length} loại cho chuồng bị bệnh
                và {medicationDataOfSeperatorCage.length} loại cho chuồng cách
                ly ){' '}
              </span>
              <span className='h-px flex-1 bg-black'></span>
            </span>
            <div
              className={cn(
                'w-full grid  gap-2 mt-2',
                isSeperatorCage ? 'grid-cols-2' : 'grid-cols-1'
              )}
            >
              <div>
                <div>Đơn thuốc cho chuồng bị bệnh </div>
                {medicationDataOfCage.map((item, index) => (
                  <div
                    key={index}
                    className=' rounded-lg border border-gray-100 py-3 shadow-sm mt-3'
                  >
                    <dl className='-my-3 divide-y divide-gray-100 text-sm'>
                      <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                        <dt className='font-medium text-gray-900'>Tên thuốc</dt>
                        <dd className='text-gray-700 sm:col-span-2'>
                          {medications
                            ? medications.items.find(
                                (medication) =>
                                  medication.id === item.medicationId
                              )?.name
                            : 'Chưa chọn thuốc'}
                        </dd>
                      </div>

                      <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                        <dt className='font-medium text-gray-900'>
                          Liều lượng
                        </dt>
                        <dd className='text-gray-700 sm:col-span-2'>
                          {item.dosage}
                        </dd>
                      </div>

                      <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                        <dt className='font-medium text-gray-900'>Buổi </dt>
                        <dd className='text-gray-700 sm:col-span-2'>
                          {item.sessions.join(', ')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
              {isSeperatorCage ? (
                <div className=''>
                  <div>Đơn thuốc cho chuồng cách ly </div>
                  {medicationDataOfSeperatorCage.map((item, index) => (
                    <div
                      key={index}
                      className=' rounded-lg border border-gray-100 py-3 shadow-sm mt-3'
                    >
                      <dl className='-my-3 divide-y divide-gray-100 text-sm'>
                        <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                          <dt className='font-medium text-gray-900'>
                            Tên thuốc
                          </dt>
                          <dd className='text-gray-700 sm:col-span-2'>
                            {medications
                              ? medications.items.find(
                                  (medication) =>
                                    medication.id === item.medicationId
                                )?.name
                              : 'Chưa chọn thuốc'}
                          </dd>
                        </div>

                        <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                          <dt className='font-medium text-gray-900'>
                            Liều lượng
                          </dt>
                          <dd className='text-gray-700 sm:col-span-2'>
                            {item.dosage}
                          </dd>
                        </div>

                        <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                          <dt className='font-medium text-gray-900'>Buổi </dt>
                          <dd className='text-gray-700 sm:col-span-2'>
                            {item.sessions.join(', ')}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className='flex justify-end gap-2 mt-3'>
            <Button onClick={handlePrev}>Quay lại</Button>
            <Button onClick={() => handleNext()}>Tiếp tục</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TaskCard;
