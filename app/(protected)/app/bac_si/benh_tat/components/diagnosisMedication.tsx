'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { docterApi, tasksApi } from '@/config/api';
import { MedicalSymptomDTO } from '@/dtos/MedicalSymptomDTO';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { set } from 'lodash';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import * as z from 'zod';

const formSchema = z.object({
  diagnosis: z
    .string({ message: 'Chuẩn đoán bệnh không được để trống' })
    .min(1, { message: 'Chuẩn đoán bệnh không được để trống' }),
  treatment: z.string().optional(),
  notes: z
    .string({ message: 'Ghi chú không được để trống' })
    .min(1, { message: 'Ghi chú không được để trống' }),
  addMedication: z.boolean().optional(),
});

export default function DiagnosisMedication({
  className,
  medicalsymptoms,
  children,
  hasAddMedication,
  setHasAddMedication,
}: {
  className?: string;
  medicalsymptoms: MedicalSymptomDTO;
  children?: React.ReactNode;
  hasAddMedication: boolean;
  setHasAddMedication: (value: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const diagnosisMedical = useMutation({
    mutationFn: async (data: any) => {
      // return await docterApi.changeDiagnosis(data, medicalsymptoms.id);
      return Promise.resolve(true);
    },
    onSuccess() {
      toast.success('Đã thêm chuẩn đoán bệnh thành công');
      queryClient.invalidateQueries({ queryKey: ['medicalSymptom'] });
      form.reset();
      if (form.watch('addMedication')) {
        setHasAddMedication(true);
      }
      setOpen(false);
    },
    onError(erorr: any) {
      console.error('Có lỗi khi chuẩn đoán ', erorr);
      toast.error(
        erorr.response?.data?.result?.message || 'Có lỗi khi chuẩn đoán'
      );
      setHasAddMedication(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
      const requestData = {
        ...values,
        addMedication: undefined,
        status: form.watch('addMedication') ? 'Diagnosed' : 'Normal',
      };
      console.log('requestData', requestData);
      diagnosisMedical.mutate(requestData);
      if (form.watch('addMedication')) {
        setHasAddMedication(true);
      } else {
        setHasAddMedication(false);
      }
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={cn(className)} size='md'>
        <DialogHeader>
          <DialogTitle>Chuẩn đoán bệnh </DialogTitle>
          <DialogDescription>
            {medicalsymptoms?.nameAnimal} - {medicalsymptoms?.symptoms}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`space-y-2 w-full `}
          >
            <FormField
              control={form.control}
              name='diagnosis'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chuẩn đoán bệnh</FormLabel>
                  <FormControl>
                    <Input placeholder='' type='text' {...field} />
                  </FormControl>
                  <FormDescription>
                    Dựa vào hình ảnh và triệu chứng để chuẩn đoán bệnh
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='addMedication'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel>Vật nuôi cần điều trị bằng thuốc </FormLabel>
                    <FormDescription>
                      Trạng thái mặc định thì vật nuôi không cần điều trị bằng
                      thuốc. Nếu cần điều trị thì bật nút bên cạnh!
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(e) => {
                        field.onChange(e);
                      }}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('addMedication') && (
              <FormField
                control={form.control}
                name='treatment'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phương pháp điều trị</FormLabel>
                    <FormControl>
                      <Input placeholder='' type='text' {...field} />
                    </FormControl>
                    <FormDescription>Nhập phương pháp điều trị</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=''
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='w-full flex justify-end gap-2'>
              <Button type='reset' variant={'outline'}>
                Đặt lại
              </Button>
              <Button type='submit'>Lưu chuẩn đoán</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
