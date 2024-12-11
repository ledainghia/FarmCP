'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CalendarIcon, Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCagesQuery } from '@/hooks/use-query';
import useCageStore from '@/config/zustandStore/cagesStore';
import { CageDTO } from '@/dtos/cageDTO';
import { useGetStaffPendingMutation } from '@/hooks/use-mutation';

const assigneeOptions = [
  { value: 'mahedi', label: 'Mahedi Amin', image: '/images/avatar/av-1.svg' },
  { value: 'sovo', label: 'Sovo Haldar', image: '/images/avatar/av-2.svg' },
  {
    value: 'rakibul',
    label: 'Rakibul Islam',
    image: '/images/avatar/av-3.svg',
  },
  { value: 'pritom', label: 'Pritom Miha', image: '/images/avatar/av-4.svg' },
];

const FormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  assign: z.string().optional(),
  tag: z.string().optional(),
  cages: z.string(),
  dob: z.date().optional(),
  description: z.string().optional(),
});

const CreateTodo = () => {
  const t = useTranslations('TodoApp');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [cageChoice, setCageChoice] = useState<string>('');
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
    },
  });

  const { data: cases, isLoading, error } = useCagesQuery();
  const setCages = useCageStore((state) => state.setCages); // Zustand action

  useEffect(() => {
    if (cases && cases?.totalItems > 0) {
      console.info('Cages:', cases);
      setCages(cases.items); // Update Zustand store
    }
  }, [cases, setCages]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('Form Data:', data);
    toast({
      title: 'Task created successfully.',
    });
    setIsDialogOpen(false);
  }

  const getStaffPendingMutation = useGetStaffPendingMutation(cageChoice);
  const handleCageChange = (value: string) => {
    setCageChoice(value);
    if (!value) return;
    getStaffPendingMutation.mutate();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button fullWidth size='lg'>
          Phân công công việc
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className='mb-4'>
          <DialogTitle> Phân công công việc</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-default-700'>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter Title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='cages'
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
              name='assign'
              disabled={
                !form.getValues('cages') || getStaffPendingMutation.isPending
              }
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-default-700'>Assign</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!form.getValues('cages')}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn nhân viên...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assigneeOptions.map((user, index) => (
                        <SelectItem key={`staff-${index}`} value={user.value}>
                          <div className='flex items-center gap-2'>
                            <Image
                              src={user.image}
                              alt={user.label}
                              width={20}
                              height={20}
                              className='w-5 h-5 rounded-full'
                            />
                            <span className='text-sm text-default-900'>
                              {user.label}
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
              name='dob'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='text-default-700'>Due Date</FormLabel>
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
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon
                            className={cn('ms-auto h-4 w-4 text-default-300', {
                              'text-default-900': field.value,
                            })}
                          />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
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
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-default-700'>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Tell us a little bit about yourself'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button type='submit'>Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTodo;
