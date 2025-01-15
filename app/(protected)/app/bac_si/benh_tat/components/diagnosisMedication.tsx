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
import {
  SingleSelector,
  SingleSelectorContent,
  SingleSelectorInput,
  SingleSelectorItem,
  SingleSelectorList,
  SingleSelectorTrigger,
} from '@/components/ui/single-select';
import { Textarea } from '@/components/ui/textarea';
import { docterApi } from '@/config/api';
import { StandardprescriptionDTO } from '@/dtos/MedicationDTO';
import { useDiseaseQuery } from '@/hooks/use-query';
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
  (
    props: {
      className?: string;
      standardPrescription: StandardprescriptionDTO | null;
      setStandardPrescription: (
        standardPrescription: StandardprescriptionDTO
      ) => void;
    },
    ref
  ) => {
    const { className, standardPrescription, setStandardPrescription } = props;
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const { data: diseases } = useDiseaseQuery();

    function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        console.log(values);
        // toast(
        //   <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
        //     <code className='text-white'>
        //       {JSON.stringify(values, null, 2)}
        //     </code>
        //   </pre>
        // );
        const requestData = {
          ...values,
          addMedication: undefined,
          status: 'Diagnosed',
        };
        console.log('requestData', requestData);
        // diagnosisMedical.mutate(requestData);
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

    const getMedicationByDiagnosisMutation = useMutation({
      mutationFn: async (data: string) => {
        return await docterApi.getMedicationByDisease(data);
        // return Promise.resolve(true);
      },
      onSuccess(data) {
        toast.success('Đã thêm đơn thuốc mẫu thành công');
        console.log('data', data.data.result);
        if (data.data.result) {
          setStandardPrescription(data.data.result);
        }
        // setStandardPrescription(data);
      },
      onError(erorr: any) {
        console.error('Có lỗi lấy đơn thuốc mẫu ', erorr);
        toast.error(
          erorr.response?.data?.result?.message || 'Có lỗi lấy đơn thuốc mẫu'
        );
      },
    });

    const handleGetMedicationByDiagnosis = (value: string) => {
      const medication = diseases?.items?.find((item) => item.name === value);
      if (!medication) return;
      getMedicationByDiagnosisMutation.mutate(medication.id);
    };

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
                  <FormLabel required>Chuẩn đoán bệnh</FormLabel>
                  <FormControl>
                    <SingleSelector
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                        if (e) handleGetMedicationByDiagnosis(e);
                        console.log(e);
                      }}
                      className='mt-0'
                    >
                      <SingleSelectorTrigger className='!mt-0 !rounded-sm'>
                        <SingleSelectorInput
                          placeholder={
                            field.value ? '' : 'Chọn chuẩn đoán bệnh '
                          }
                          className='text-sm'
                        />
                      </SingleSelectorTrigger>
                      <SingleSelectorContent>
                        <SingleSelectorList>
                          {diseases?.items?.map((item) => (
                            <SingleSelectorItem key={item.id} value={item.name}>
                              {item.name}
                            </SingleSelectorItem>
                          ))}
                        </SingleSelectorList>
                      </SingleSelectorContent>
                    </SingleSelector>
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
