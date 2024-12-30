'use client';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { farmsApi } from '@/config/api';
import { cleanObject } from '@/utils/cleanObj';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { z } from 'zod';

const FormSchema = z.object({
  name: z.string({ message: 'Tên là mục bắt buộc' }),
  species: z.string({ message: 'Loài là mục bắt buộc' }),
  defaultCapacity: z.number().min(0, { message: 'Số lượng phải lớn hơn 0' }),
  notes: z.string().optional(),
});

const AnimalsTemplateDialog = () => {
  const clientQuery = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const addNewAnimalTemplate = useMutation({
    mutationFn: (data: z.infer<typeof FormSchema>) =>
      farmsApi.createAnimalTemplate(data),
    onSuccess: () => {
      clientQuery.invalidateQueries({
        queryKey: ['animalsTemplates'],
      });
      setIsDialogOpen(false);
      form.reset();
      toast.success('Thêm mới vật nuôi mẫu thành công');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('Form Data:', cleanObject(data));
    addNewAnimalTemplate.mutate(data);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size='md'>Thêm mới vật nuôi mẫu</Button>
      </DialogTrigger>
      <DialogContent size='md'>
        <DialogHeader className='mb-4'>
          <DialogTitle> Thêm mới vật nuôi mẫu</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Tên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập tên cho mẫu'
                          type='text'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='species'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Chủng loại</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập chủng loại'
                          type='text'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name='defaultCapacity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Số lượng vật nuôi mặc định</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nhập số lượng vật nuôi mặc định'
                      type='number'
                      {...field}
                      onChange={(event) => {
                        field.onChange(Number(event.target.value));
                        console.log(typeof +event.target.value);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Nhập ghi chú nếu có'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>

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
              <Button type='submit' className='font-bold'>
                Lưu
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AnimalsTemplateDialog;
