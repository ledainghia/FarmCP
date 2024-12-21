'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
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

const FormSchema = z.object({
  taskName: z.string().min(2, {
    message: 'Tiêu đề có ít nhất 2 kí tự',
  }),
  assignedToUserId: z.string().optional(),
  // tag: z.string().optional(),
  cageId: z.string(),
  dueDate: z.date().optional(),
  description: z.string().optional(),
  session: z.enum(['Morning', 'Afternoon', 'Evening'], {
    message: 'Buổi không hợp lệ',
  }),
  taskTypeId: z.string().optional(),
  createdByUserId: z.string().optional(),
});

const CreateTodo = () => {
  const clientQuery = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [cageChoice, setCageChoice] = useState<string>('');
  const [staffPendingTask, setStaffPendingTask] = useState<
    StaffWithCountTaskDTO[]
  >([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      taskName: '',
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
    createTaskMutation.mutate(payload);
    // console.log('Form Data:', payload);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <div className='grid grid-cols-2 w-full gap-2'>
              <FormField
                control={form.control}
                disabled={true}
                name='taskName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-default-700'>
                      Tiêu đề aaaa
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={true}
                        placeholder='Enter Title'
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
                    <FormLabel className='text-default-700'>
                      Loại công việc
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select...' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TaskType.map((item) => (
                          <SelectItem
                            key={item.taskTypeId}
                            value={item.taskTypeId}
                          >
                            {item.taskTypeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 w-full gap-2'>
              <FormField
                control={form.control}
                name='cageId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-default-700'>
                      Chọn chuồng
                    </FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                        handleCageChange(e);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn...' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cases &&
                          Array.isArray(cases.items) &&
                          cases.items.map((item: CageDTO) => (
                            <SelectItem
                              key={`item_cages` + item.id}
                              value={item.id}
                            >
                              <div className='flex items-center gap-2'>
                                <span className='text-sm text-default-900'>
                                  {item.name}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='assignedToUserId'
                disabled={
                  !form.getValues('cageId') || getStaffPendingMutation.isPending
                }
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-default-700'>
                      Phân công cho
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.getValues('cageId')}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn nhân viên...' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getStaffPendingMutation.data?.data.result &&
                          getStaffPendingMutation.data?.data.result.length >
                            0 &&
                          getStaffPendingMutation.data?.data.result.map(
                            (user: any, index: any) => (
                              <SelectItem
                                key={`staff-${index}`}
                                value={user.staffId}
                              >
                                <div className='flex items-center gap-2'>
                                  {/* <Image
                              src={user.image}
                              alt={user.label}
                              width={20}
                              height={20}
                              className='w-5 h-5 rounded-full'
                            /> */}
                                  <span className='text-sm text-default-900'>
                                    {user.fullName} ( đang thực hiện{' '}
                                    {user.pendingTaskCount} công việc )
                                  </span>
                                </div>
                              </SelectItem>
                            )
                          )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-2 w-full gap-2'>
              <FormField
                control={form.control}
                name='dueDate'
                render={({ field }) => (
                  <FormItem className=''>
                    <FormLabel className='text-default-700'>
                      Chọn ngày
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            size='md'
                            fullWidth
                            className={cn(
                              'border-default md:px-3',
                              !field.value &&
                                'text-muted-foreground border-default-200 md:px-3'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon
                              className={cn(
                                'ms-auto h-4 w-4 text-default-300',
                                {
                                  'text-default-900': field.value,
                                }
                              )}
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
                              'w-full  space-y-4 sm:gap-x-4 sm:space-y-0 flex',
                          }}
                          locale={vi}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() ||
                            date >
                              new Date(
                                new Date().setDate(new Date().getDate() + 2)
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
                name='session'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-default-700'>
                      Chọn buổi
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select...' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Morning'>Buổi sáng</SelectItem>
                        <SelectItem value='Afternoon'>Buổi chiều</SelectItem>
                        <SelectItem value='Evening'>Buổi tối</SelectItem>
                        <SelectItem value='AllDay'>Cả ngày</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <FormField
              control={form.control}
              name='tag'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-default-700'>Tag</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='team'>Team</SelectItem>
                      <SelectItem value='low'>Low</SelectItem>
                      <SelectItem value='medium'>Medium</SelectItem>
                      <SelectItem value='high'>High</SelectItem>
                      <SelectItem value='update'>Update</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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

export default CreateTodo;
