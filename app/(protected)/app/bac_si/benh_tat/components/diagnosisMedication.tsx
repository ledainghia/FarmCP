'use client';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MedicalSymptomDTO } from '@/dtos/MedicalSymptomDTO';
import { Switch } from '@/components/ui/switch';
import { set } from 'lodash';

const formSchema = z.object({
  diagnosis: z
    .string({ message: 'Chuẩn đoán bệnh không được để trống' })
    .min(1, { message: 'Chuẩn đoán bệnh không được để trống' }),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  addMedication: z.boolean(),
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
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
      if (form.watch('addMedication')) {
        setHasAddMedication(true);
      } else {
        setHasAddMedication(false);
      }
      setOpen(false);
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
        setHasAddMedication(false);
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
                    <FormLabel>Chữa bằng thuốc</FormLabel>
                    <FormDescription>
                      Nếu bạn muốn kê đơn thuốc thì tích vào ô này. Không thì bỏ
                      qua và bấm gửi khi hoàn tất quá trình
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
              <Button type='submit'>Lưu</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
