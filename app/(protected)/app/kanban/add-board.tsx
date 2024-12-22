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
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { tasksApi } from '@/config/api';
import useCageStore from '@/config/zustandStore/cagesStore';
import { CageDTO } from '@/dtos/CageDTO';
import { StaffWithCountTaskDTO } from '@/dtos/StaffWithCountTask';
import { useGetStaffPendingMutation } from '@/hooks/use-mutation';
import { useCagesQuery } from '@/hooks/use-query';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { jwtDecode } from 'jwt-decode';
import _, { set } from 'lodash';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const TaskType = [
  {
    taskTypeId: '37fcbc5f-4824-4151-ac05-a65240334c70',
    taskTypeName: 'Feed',
  },
  {
    taskTypeId: 'dbd1e320-b87c-447f-8486-b73d5d515f36',
    taskTypeName: 'Clean',
  },
];

const FormSchema = z
  .object({
    taskName: z.string({ message: 'Có lỗi khi xử lí tiêu đề tự động' }),
    assignedToUserId: z.string({ message: 'Vui lòng chọn nhân viên' }),
    cageId: z.string({ message: 'Vui lòng chọn chuồng' }),
    dueDate: z.date().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    description: z.string().optional(),
    taskTypeId: z.string({ message: 'Vui lòng chọn loại công việc' }),
    createdByUserId: z.string().optional(),
    name_3994754233: z
      .array(z.string())
      .nonempty('Vui lòng chọn ít nhất một buổi trong ngày'),
    isLoop: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isLoop) {
      if (!data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['startDate'],
          message: 'Vui lòng chọn ngày bắt đầu',
        });
      }
      if (!data.endDate) {
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
  const [cageChoice, setCageChoice] = useState<string>('');
  const [isLoop, setIsLoop] = useState<boolean>(false);

  const [staffPendingTask, setStaffPendingTask] = useState<
    StaffWithCountTaskDTO[]
  >([]);
  const [title, setTitle] = useState<string>('');
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      taskName: '',
      name_3994754233: [],
    },
  });

  const { data: cases } = useCagesQuery();
  const createTaskMutation = useMutation({
    mutationFn: (data: z.infer<typeof FormSchema>) => {
      return tasksApi.createTasks(data);
    },
    onSuccess() {
      toast({
        title: 'Task created successfully.',
      });

      form.reset();
      clientQuery.invalidateQueries({
        queryKey: ['tasks'],
      });
      setIsDialogOpen(false);
    },
    onError() {
      toast({
        title: 'Lỗi khi tạo công việc.',
        variant: 'destructive',
      });
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
    console.log('Form Data:', data);
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast({
        title: 'Access token not found.',
        variant: 'destructive',
      });
      return;
    }
    const decodedToken = jwtDecode(accessToken) as { nameid?: number };
    const payload = {
      ...data,
      dueDate: data.dueDate ? data.dueDate : undefined,
      createdByUserId: decodedToken?.nameid?.toString(),
    };
    // createTaskMutation.mutate(payload);
  }

  const getStaffPendingMutation = useGetStaffPendingMutation(cageChoice);
  const handleCageChange = (value: string) => {
    setCageChoice(value);
    if (!value) return;
    getStaffPendingMutation.mutate();
    if (getStaffPendingMutation.isError) {
      toast({
        title: 'Failed to fetch staffs.',
        variant: 'destructive',
      });
      setStaffPendingTask([]);
    } else {
      toast({
        title: 'Staffs fetched successfully.',
      });
      setStaffPendingTask(getStaffPendingMutation.data?.data.result);
      console.table('Staffs:', getStaffPendingMutation.data?.data?.result);
    }
  };

  const setTitleValue = (type: string, value: string) => {
    if (type && value) {
      let valueSet = '-';
      const currentTitle = form.getValues('taskName') || '';

      // Xử lý Task_Type
      if (type === 'Task_Type') {
        const task = TaskType.find((item) => item.taskTypeId === value);
        const taskName = task?.taskTypeName || '';
        if (currentTitle.includes('-')) {
          // Thay thế trước dấu '-'
          const [_, suffix] = currentTitle.split('-');
          valueSet = `${taskName} -${suffix}`;
        } else {
          // Thêm mới
          valueSet = `${taskName} -`;
        }
      }
      // Xử lý Cage
      else if (type === 'Cage') {
        const cage = cases?.items.find((item) => item.id === value);
        const cageName = cage?.name || '';
        if (currentTitle.includes('-')) {
          // Thay thế sau dấu '-'
          const [prefix] = currentTitle.split('-');
          valueSet = `${prefix}- ${cageName}`;
        } else {
          // Thêm mới
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
        <Button fullWidth size='lg'>
          Phân công công việc
        </Button>
      </DialogTrigger>
      <DialogContent size='lg'>
        <DialogHeader className='mb-4'>
          <DialogTitle> Phân công công việc</DialogTitle>
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
                  <FormItem>
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
                  <FormItem>
                    <FormLabel>
                      Loại công việc <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                        setTitleValue('Task_Type', e);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            className='text-sm'
                            placeholder='Select...'
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TaskType.map((item) => (
                          <SelectItem
                            key={item.taskTypeId}
                            value={item.taskTypeId}
                          >
                            <span className='text-sm text-default-900'>
                              {item.taskTypeName}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                                  )?.name
                                : 'Select language'}
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
                              {cases?.items.map((language) => (
                                <CommandItem
                                  value={language.name}
                                  key={language.id}
                                  onSelect={() => {
                                    form.setValue('cageId', language.id);
                                    handleCageChange(language.id);
                                    setTitleValue('Cage', language.id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      language.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {language.name}
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
                    <FormLabel required={true}>Phân công cho</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='checkbox'
                            size='md'
                            disabled={
                              !form.getValues('cageId') ||
                              getStaffPendingMutation.isPending
                            }
                            className={cn(
                              '!px-3 ',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className='flex flex-1'>
                              {getStaffPendingMutation.data?.data.result &&
                                getStaffPendingMutation.data?.data.result
                                  .length > 0 &&
                                getStaffPendingMutation.data?.data.result.find(
                                  (item: StaffWithCountTaskDTO) =>
                                    item.staffId === field.value
                                )?.fullName}
                            </span>
                            <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className={cn(`w-[43vw] p-0`)}>
                        <Command>
                          <CommandInput placeholder='Tìm kiếm nhân viên...' />
                          <CommandList>
                            <CommandEmpty>
                              Không tìm thấy nhân viên
                            </CommandEmpty>
                            <CommandGroup>
                              {getStaffPendingMutation.data?.data.result &&
                                getStaffPendingMutation.data?.data.result
                                  .length > 0 &&
                                getStaffPendingMutation.data?.data.result.map(
                                  (item: StaffWithCountTaskDTO) => (
                                    <CommandItem
                                      value={item.fullName}
                                      key={item.staffId}
                                      onSelect={() => {
                                        form.setValue(
                                          'assignedToUserId',
                                          item.staffId
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          item.staffId === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      <span className='text-sm text-default-900'>
                                        {item.fullName} ( đang thực hiện{' '}
                                        {item.pendingTaskCount} công việc )
                                      </span>
                                    </CommandItem>
                                  )
                                )}
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
                      name='startDate'
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
                      name='endDate'
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
                                      form.getValues('startDate')
                                        ? new Date(
                                            form.getValues('startDate')!
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
                name='name_3994754233'
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
                <FormItem>
                  <FormLabel className='text-default-700'>
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
            <div className='flex justify-end gap-2'>
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
