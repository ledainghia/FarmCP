'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { tasksApi } from '@/config/api';
import useCageStore from '@/config/zustandStore/cagesStore';
import { StaffWithCountTaskDTO } from '@/dtos/StaffWithCountTask';
import { TaskTypeDTO } from '@/dtos/TaskTypeDTO';
import { useCagesQuery, useTaskTypesQuery } from '@/hooks/use-query';
import { cn } from '@/lib/utils';
import { cleanObject } from '@/utils/cleanObj';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { jwtDecode } from 'jwt-decode';
import _ from 'lodash';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { z } from 'zod';
const FormSchema = z
  .object({
    taskName: z.string({ message: 'Có lỗi khi xử lí tiêu đề tự động' }),
    assignedToUserId: z.string().optional(),
    cageId: z.string({ message: 'Vui lòng chọn chuồng' }),
    dueDate: z.date().optional(),
    startAt: z.date().optional(),
    endAt: z.date().optional(),
    description: z.string({ message: 'Vui lòng nhập mô tả công việc' }),
    taskTypeId: z.string({ message: 'Vui lòng chọn loại công việc' }),
    createdByUserId: z.string().optional(),
    sessions: z
      .array(z.string())
      .nonempty('Vui lòng chọn ít nhất một buổi trong ngày'),
    isLoop: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isLoop) {
      if (!data.startAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['startDate'],
          message: 'Vui lòng chọn ngày bắt đầu',
        });
      }
      if (!data.endAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endDate'],
          message: 'Vui lòng chọn ngày kết thúc',
        });
      }
    } else if (!data.dueDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dueDate'],
        message: 'Vui lòng chọn ngày',
      });
    }
  });

const AddBoard = () => {
  const clientQuery = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [staffPendingTask, setStaffPendingTask] =
    useState<StaffWithCountTaskDTO>();
  const [title, setTitle] = useState<string>('');
  const [isLoop, setIsLoop] = useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      taskName: '',
      sessions: [],
    },
  });

  const { data: cases } = useCagesQuery();
  const { data: taskTypes } = useTaskTypesQuery();

  const createTaskMutation = useMutation({
    mutationFn: (data: any) => {
      return tasksApi.createTasks(data);
    },
    onSuccess() {
      toast.success('Công việc đã được phân công.');

      form.reset();
      clientQuery.invalidateQueries({
        queryKey: ['tasks'],
      });
      setIsDialogOpen(false);
    },
    onError(erorr: any) {
      console.error('Lỗi khi tạo công việc.', erorr);

      toast.error(
        erorr.response?.data?.result?.message || 'Lỗi khi tạo công việc.'
      );
    },
  });

  const createTaskRecurring = useMutation({
    mutationFn: (data: any) => {
      return tasksApi.createTaskRecurring(data);
    },
    onSuccess() {
      toast.success('Công việc đã được phân công.');

      form.reset();
      clientQuery.invalidateQueries({
        queryKey: ['tasks'],
      });
      setIsDialogOpen(false);
    },
    onError(erorr: any) {
      console.error('Lỗi khi tạo công việc.', erorr);

      toast.error(
        erorr.response?.data?.result?.message || 'Lỗi khi tạo công việc.'
      );
    },
  });

  const setCages = useCageStore((state) => state.setCages); // Zustand action

  useEffect(() => {
    if (cases && cases?.totalItems > 0) {
      console.info('Cages:', cases);
      setCages(cases.items); // Update Zustand store
    }
  }, [cases, setCages]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('Form Data:', cleanObject(data));
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Vui lòng đăng nhập để thực hiện thao tác.');
      return;
    }
    const decodedToken = jwtDecode(accessToken) as { nameid?: number };
    const sessionMapping: { [key: string]: number } = {
      'Buổi sáng': 1,
      'Buổi trưa': 2,
      'Buổi chiều': 3,
      'Buổi tối': 4,
    };
    if (!data.isLoop) {
      const payload = {
        ...data,
        dueDate: data.dueDate
          ? new Date(data.dueDate.getTime() + 24 * 60 * 60 * 1000)
          : undefined,
        createdByUserId: decodedToken?.nameid?.toString(),
        isLoop: undefined,
        session: data.sessions.map((session) => sessionMapping[session]),
      };
      createTaskMutation.mutate(payload);
    } else {
      const payload = {
        ...data,
        createdByUserId: decodedToken?.nameid?.toString(),
        isLoop: undefined,
        dueDate: undefined,
        sessions: data.sessions.map((session) => sessionMapping[session]),
      };
      createTaskRecurring.mutate(payload);
    }
  }

  const handleCageChange = (value: string) => {
    if (!value) return;
    const cageCh = cases?.items?.find((item) => item.id === value);
    if (!cageCh || !cageCh.staffId || !cageCh.staffName) {
      return;
    }
    const staff: StaffWithCountTaskDTO = {
      staffId: cageCh.staffId,
      staffName: cageCh.staffName,
    };

    setStaffPendingTask(staff);
  };

  const setTitleValue = (type: string, value: string) => {
    if (type && value) {
      let valueSet = '-';
      const currentTitle = form.getValues('taskName') || '';
      if (type === 'Task_Type') {
        const task = taskTypes?.find((item: TaskTypeDTO) => item.id === value);
        const taskName = task?.taskTypeName || '';
        if (currentTitle.includes('-')) {
          const [_, suffix] = currentTitle.split('-');
          valueSet = `${taskName} -${suffix}`;
        } else {
          valueSet = `${taskName} -`;
        }
      } else if (type === 'Cage') {
        const cage = cases?.items.find((item) => item.id === value);
        const cageName = cage?.name || '';
        if (currentTitle.includes('-')) {
          const [prefix] = currentTitle.split('-');
          valueSet = `${prefix}- ${cageName}`;
        } else {
          valueSet = `- ${cageName}`;
        }
      }
      setTitle(valueSet);
      form.setValue('taskName', valueSet);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size='lg'>Phân công công việc</Button>
      </DialogTrigger>
      <DialogContent size='lg'>
        <DialogHeader className='mb-4'>
          <DialogTitle>Phân công công việc</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onError={(e) => {
              console.error(e);
            }}
            className='space-y-2'
          >
            <div className='grid grid-cols-2 w-full gap-2'>
              <FormField
                control={form.control}
                name='taskName'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-full'>
                    <FormLabel className='text-default-700'>
                      Tiêu đề <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        className='text-sm'
                        placeholder='Tiêu đề được tạo tự động'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='taskTypeId'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-full'>
                    <FormLabel>
                      Loại công việc <span className='text-destructive'>*</span>
                    </FormLabel>
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
                              {taskTypes
                                ? taskTypes.find(
                                    (task: TaskTypeDTO) =>
                                      task.id === field.value
                                  )?.taskTypeName || 'Chọn loại công việc'
                                : 'Chọn loại công việc'}
                            </span>
                            <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className={cn(`w-[43vw] p-0`)}>
                        <Command>
                          <CommandInput placeholder='Tìm kiếm loại công việc...' />
                          <CommandList>
                            <CommandEmpty>
                              Không tìm thấy loại công việc nào{' '}
                            </CommandEmpty>
                            <CommandGroup>
                              {taskTypes?.map((task) => (
                                <CommandItem
                                  value={task.taskTypeName}
                                  key={task.id}
                                  onSelect={() => {
                                    field.onChange(task.id);
                                    setTitleValue('Task_Type', task.id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      task.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {task.taskTypeName} - [Mức độ ưu tiên{' '}
                                  {task.priorityNum}]
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
            </div>

            <div className='grid grid-cols-2 w-full gap-2 items-start'>
              {/* Field chọn chuồng */}
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
                                    (language) => language.id === field.value
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
                            <CommandEmpty>Không tìm thấy chuồng</CommandEmpty>
                            <CommandGroup>
                              {cases?.items
                                .filter((item) => !!item.farmingBatch)
                                .map((cage) => (
                                  <CommandItem
                                    value={cage.name}
                                    key={cage.id}
                                    onSelect={() => {
                                      form.setValue('cageId', cage.id);
                                      handleCageChange(cage.id);
                                      setTitleValue('Cage', cage.id);
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
              {/* Field phân công */}
              <FormField
                control={form.control}
                name='assignedToUserId'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-full'>
                    <FormLabel required={true}>Nhân viên quản lí</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        className='text-sm'
                        placeholder='Phân công tự động'
                        value={staffPendingTask?.staffName}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 w-full gap-4 items-start'>
              <div className='grid grid-cols-3 w-full gap-4'>
                <FormField
                  control={form.control}
                  name='isLoop'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(e) => {
                            field.onChange(e);
                            setIsLoop(e ? true : false);
                          }}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Công việc có thể lặp lại</FormLabel>

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                {!isLoop ? (
                  <FormField
                    control={form.control}
                    name='dueDate'
                    render={({ field }) => (
                      <FormItem className='flex flex-col col-span-2'>
                        <FormLabel required={true} className='text-default-700'>
                          Chọn ngày
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                size='md'
                                className={cn(
                                  'border-default md:px-3',
                                  !field.value &&
                                    'text-muted-foreground border-default-200 md:px-3'
                                )}
                              >
                                {field.value ? (
                                  _.capitalize(
                                    format(field.value, 'PPP', {
                                      locale: vi,
                                    }).trim()
                                  )
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon
                                  className={cn('ms-auto h-4 w-4')}
                                />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={field.value}
                              classNames={{
                                months:
                                  'w-full space-y-4 sm:gap-x-4 sm:space-y-0 flex',
                              }}
                              locale={vi}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date <
                                  new Date(
                                    new Date().setDate(new Date().getDate() - 1)
                                  ) ||
                                date >
                                  new Date(
                                    new Date().setDate(new Date().getDate() + 1)
                                  )
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name='startAt'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel
                            required={true}
                            className='text-default-700'
                          >
                            Từ ngày
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  size='md'
                                  className={cn(
                                    'border-default md:px-3',
                                    !field.value &&
                                      'text-muted-foreground border-default-200 md:px-3'
                                  )}
                                >
                                  {field.value ? (
                                    _.capitalize(
                                      format(field.value, 'PPP', {
                                        locale: vi,
                                      }).trim()
                                    )
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon
                                    className={cn('ms-auto h-4 w-4 ')}
                                  />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className='w-auto p-0'
                              align='start'
                            >
                              <Calendar
                                mode='single'
                                selected={field.value}
                                classNames={{
                                  months:
                                    'w-full space-y-4 sm:gap-x-4 sm:space-y-0 flex',
                                }}
                                locale={vi}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date <
                                  new Date(
                                    new Date().setDate(new Date().getDate() - 1)
                                  )
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='endAt'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel required={true}>Đến ngày</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  size='md'
                                  className={cn(
                                    'border-default md:px-3',
                                    !field.value && 'border-default-200 md:px-3'
                                  )}
                                >
                                  {field.value ? (
                                    _.capitalize(
                                      format(field.value, 'PPP', {
                                        locale: vi,
                                      }).trim()
                                    )
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon
                                    className={cn('ms-auto h-4 w-4 ')}
                                  />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className='w-auto p-0'
                              align='start'
                            >
                              <Calendar
                                mode='single'
                                selected={field.value}
                                classNames={{
                                  months:
                                    'w-full space-y-4 sm:gap-x-4 sm:space-y-0 flex',
                                }}
                                locale={vi}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date <
                                  new Date(
                                    new Date().setDate(
                                      form.getValues('startAt')
                                        ? new Date(
                                            form.getValues('startAt')!
                                          ).getDate() - 1
                                        : new Date().getDate() - 1
                                    )
                                  )
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              {/* Chọn buổi */}
              <FormField
                control={form.control}
                name='sessions'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel required={true}>Chọn buổi</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={(e) => {
                          field.onChange(e);
                          console.log(e);
                        }}
                        loop
                        className='mt-0'
                      >
                        <MultiSelectorTrigger className='!mt-0 !rounded-sm'>
                          <MultiSelectorInput
                            placeholder={field.value.length ? '' : 'Chọn buổi'}
                            className='text-sm'
                          />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            <MultiSelectorItem value='Buổi sáng'>
                              Buổi sáng
                            </MultiSelectorItem>
                            <MultiSelectorItem value='Buổi trưa'>
                              Buổi trưa
                            </MultiSelectorItem>
                            <MultiSelectorItem value='Buổi chiều'>
                              Buổi chiều
                            </MultiSelectorItem>
                            <MultiSelectorItem value='Buổi tối'>
                              Buổi tối
                            </MultiSelectorItem>
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='flex flex-col w-full'>
                  <FormLabel required className='text-default-700'>
                    Chi tiết công việc
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Nhập chi tiết công việc'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='pt-9 flex justify-end gap-2 '>
              <Button
                type='reset'
                variant={'outline'}
                onClick={(e) => {
                  e.preventDefault();
                  form.reset();
                }}
                className='font-bold'
              >
                Đặt lại
              </Button>
              <Button
                type='submit'
                disabled={createTaskMutation.isPending}
                className='font-bold'
              >
                {createTaskMutation.isPending
                  ? 'Đang thực hiện...'
                  : 'Phân công'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBoard;
