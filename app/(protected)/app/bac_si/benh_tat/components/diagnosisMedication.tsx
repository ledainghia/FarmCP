'use client';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import * as z from 'zod';

const formSchema = z.object({
  diagnosis: z
    .string({ message: 'Chuẩn đoán bệnh không được để trống' })
    .min(1, { message: 'Chuẩn đoán bệnh không được để trống' }),
  notes: z
    .string({ message: 'Ghi chú không được để trống' })
    .min(1, { message: 'Ghi chú không được để trống' }),
});

export const DiagnosisMedication = forwardRef(
  (props: { className?: string }, ref) => {
    const { className } = props;
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const diagnosisMedical = useMutation({
      mutationFn: async (data: any) => {
        // return await docterApi.changeDiagnosis(data, medicalsymptoms.id);
        return Promise.resolve(true);
      },
      onSuccess() {
        toast.success('Đã thêm chuẩn đoán bệnh thành công');
        queryClient.invalidateQueries({ queryKey: ['medicalSymptom'] });
        form.reset();

        setOpen(false);
      },
      onError(erorr: any) {
        console.error('Có lỗi khi chuẩn đoán ', erorr);
        toast.error(
          erorr.response?.data?.result?.message || 'Có lỗi khi chuẩn đoán'
        );
      },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        console.log(values);
        toast(
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>
              {JSON.stringify(values, null, 2)}
            </code>
          </pre>
        );
        const requestData = {
          ...values,
          addMedication: undefined,
          status: 'Diagnosed',
        };
        console.log('requestData', requestData);
        diagnosisMedical.mutate(requestData);
      } catch (error) {
        console.error('Form submission error', error);
        toast.error('Failed to submit the form. Please try again.');
      }
    }

    const handleSubmit = () => {
      buttonRef.current?.click();
      console.log('submit');
    };

    const getValidValue = () => {
      console.log('getValidValues');
      try {
        formSchema.parse(form.getValues());
        return form.getValues();
      } catch (error) {
        return null;
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit,
      getValidValue: getValidValue,
    }));

    return (
      <div className={cn('w-full', className)}>
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
              <Button type='submit' className='hidden' ref={buttonRef}>
                Lưu chuẩn đoán
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }
);
DiagnosisMedication.displayName = 'DiagnosisMedication';
export default DiagnosisMedication;
