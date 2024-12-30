'use client';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { farmsApi } from '@/config/api';
import toast from 'react-hot-toast';
import farmStore from '@/config/zustandStore/farmStore';

const formSchema = z.object({
  name: z.string(),
  area: z.number().min(0, { message: 'Diện tích phải lớn hơn 0' }),
  capacity: z.number().min(0, { message: 'Sức chứa phải lớn hơn 0' }),
  location: z.string(),
  animalType: z.string(),
});

export default function AddCageDialog() {
  const clientQuery = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { farm } = farmStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const addNewCage = useMutation({
    mutationFn: (data: any) => farmsApi.createCage(data),
    onSuccess: () => {
      clientQuery.invalidateQueries({
        queryKey: ['cages'],
      });
      setIsDialogOpen(false);
      form.reset();
      toast.success('Thêm chuồng mới thành công');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const submitValues = {
      ...values,
      farmId: farm?.id,
    };
    addNewCage.mutate(submitValues);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size='md'>Thêm chuồng mới </Button>
      </DialogTrigger>
      <DialogContent size='md'>
        <DialogHeader className='mb-4'>
          <DialogTitle> Thêm chuồng mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tên chuồng</FormLabel>
                  <FormControl>
                    <Input placeholder='' type='text' {...field} />
                  </FormControl>
                  <FormDescription>Nhập tên chuồng</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='area'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Diện tích</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=''
                          type='number'
                          {...field}
                          onChange={(event) => {
                            field.onChange(Number(event.target.value));
                            console.log(typeof +event.target.value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>Nhập diện tích </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='capacity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Sức chứa</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=''
                          type='number'
                          {...field}
                          onChange={(event) => {
                            field.onChange(Number(event.target.value));
                            console.log(typeof +event.target.value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>Nhập sức chứa</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name='animalType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Loại vật nuôi</FormLabel>
                  <FormControl>
                    <Input placeholder='' type='text' {...field} />
                  </FormControl>
                  <FormDescription>Nhập loại vật nuôi</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Vị trí</FormLabel>
                  <FormControl>
                    <Input placeholder='' type='text' {...field} />
                  </FormControl>
                  <FormDescription>Nhập vị trí của chuồng</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end gap-2 pt-6'>
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
                disabled={addNewCage.isPending ? true : false}
                className='font-bold'
              >
                {addNewCage.isPending ? 'Đang thêm...' : 'Thêm mới'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
