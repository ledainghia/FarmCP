'use client';
import { Button } from '@/components/ui/button';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputNumber } from '@/components/ui/input-number';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMedicationQuery } from '@/hooks/use-query';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';

export const formSchema = z
  .object({
    id: z.number(),
    medicationId: z.string().min(1, { message: 'Hãy chọn thuốc' }),

    note: z.string().optional(),
    check: z
      .object({
        morning: z
          .object({
            checked: z.boolean().optional(),
            dosage: z.number().optional(),
          })
          .optional(),
        noon: z
          .object({
            checked: z.boolean().optional(),
            dosage: z.number().optional(),
          })
          .optional(),
        afternoon: z
          .object({
            checked: z.boolean().optional(),
            dosage: z.number().optional(),
          })
          .optional(),
        evening: z
          .object({
            checked: z.boolean().optional(),
            dosage: z.number().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const timesOfDay = ['morning', 'noon', 'afternoon', 'evening'];

    timesOfDay.forEach((time) => {
      const timeData = data.check?.[time as keyof typeof data.check];
      if (timeData?.checked && (!timeData.dosage || timeData.dosage <= 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['check', time, 'checked'],
          message: 'Nếu đã chọn chọn buổi này thì liều lượng phải lớn hơn 0',
        });
      }
    });
  });

export default function AddPrescription({
  id,
  setValue,
  value,
  onChange,
  submit,
  setSubmit,
}: {
  id: number;
  value: z.infer<typeof formSchema>;
  setValue?: (value: any) => void;
  onChange?: (values: any) => void;
  submit?: boolean;
  setSubmit: (value: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...value,
      id: id,
    },
  });

  // Theo dõi giá trị form với useWatch
  const watchedValues = useWatch({ control: form.control });

  // Gửi giá trị ra component cha khi form thay đổi
  useEffect(() => {
    if (onChange) {
      onChange(watchedValues);
    }
  }, [watchedValues, onChange]);

  const { data: medications } = useMedicationQuery();

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (setSubmit) {
      setSubmit(false);
    }
  }

  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  // Submit form khi submit === true
  useEffect(() => {
    if (submit && submitButtonRef.current) {
      submitButtonRef.current.click(); // Trigger click on the submit button
      console.log('Submit');
    }
  }, [submit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-4'>
            <FormField
              control={form.control}
              name='medicationId'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel required>Chọn thuốc </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='checkbox'
                          size='md'
                          className={cn(
                            '!px-3 !py-4',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <span className='flex flex-1'>
                            {medications
                              ? medications.items.find(
                                  (medication) => medication.id === field.value
                                )?.name || 'Chọn thuốc '
                              : 'Chọn thuốc'}
                          </span>
                          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className={cn(`w-[15vw] p-0`)}>
                      <Command>
                        <CommandInput placeholder='Tìm kiếm thuốc...' />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy</CommandEmpty>
                          <CommandGroup>
                            {medications?.items.map((medication) => (
                              <CommandItem
                                value={medication.name}
                                key={medication.id}
                                onSelect={() => {
                                  field.onChange(medication.id);
                                }}
                              >
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className='flex items-center'>
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            medication.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {medication.name}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className='w-[40rem] bg-white shadow-lg rounded-lg p-3'>
                                      <div className='flow-root rounded-lg border border-gray-100 py-3 shadow-sm'>
                                        <dl className='-my-3 divide-y divide-gray-100 text-sm'>
                                          <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                                            <dt className='font-medium text-gray-900'>
                                              Tên thuốc
                                            </dt>
                                            <dd className='text-gray-700 sm:col-span-2'>
                                              {medication.name}
                                            </dd>
                                          </div>

                                          <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                                            <dt className='font-medium text-gray-900'>
                                              Giá cả
                                            </dt>
                                            <dd className='text-gray-700 sm:col-span-2'>
                                              {medication.price.toLocaleString(
                                                'vi-VN'
                                              )}{' '}
                                              VNĐ
                                            </dd>
                                          </div>

                                          <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                                            <dt className='font-medium text-gray-900'>
                                              Giá một liều
                                            </dt>
                                            <dd className='text-gray-700 sm:col-span-2'>
                                              {medication.pricePerDose.toLocaleString(
                                                'vi-VN'
                                              )}{' '}
                                              VNĐ
                                            </dd>
                                          </div>

                                          <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                                            <dt className='font-medium text-gray-900'>
                                              Hướng dẫn sử dụng
                                            </dt>
                                            <dd className='text-gray-700 sm:col-span-2'>
                                              {medication.usageInstructions}
                                            </dd>
                                          </div>
                                          <div className='grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4'>
                                            <dt className='font-medium text-gray-900'>
                                              Liều lượng
                                            </dt>
                                            <dd className='text-gray-700 sm:col-span-2'>
                                              {medication.doseQuantity}
                                            </dd>
                                          </div>
                                        </dl>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
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

          <div className='col-span-8 flex flex-col space-y-2 '>
            <FormLabel required>Chọn buổi và liều lượng sử dụng </FormLabel>
            <div className='grid grid-cols-4 gap-4'>
              {(['morning', 'noon', 'afternoon', 'evening'] as const).map(
                (time) => (
                  <FormField
                    key={time}
                    control={form.control}
                    name={
                      `check.${time}.checked` as
                        | 'check.morning.checked'
                        | 'check.noon.checked'
                        | 'check.afternoon.checked'
                        | 'check.evening.checked'
                    }
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <div className='flex flex-row items-center justify-start h-full space-x-3 rounded-md'>
                          <FormControl>
                            <Checkbox
                              onCheckedChange={(checked) => {
                                field.onChange(checked); // Cập nhật trạng thái checkbox
                              }}
                              checked={field.value || false} // Kiểm tra trạng thái checkbox
                            />
                          </FormControl>
                          <div className='space-y-1 leading-none'>
                            <FormLabel>
                              {time === 'morning'
                                ? 'Buổi sáng'
                                : time === 'noon'
                                ? 'Buổi trưa'
                                : time === 'afternoon'
                                ? 'Buổi chiều'
                                : 'Buổi tối'}
                            </FormLabel>
                          </div>
                          {field.value === true ? ( // Chỉ hiển thị InputNumber nếu checkbox được chọn
                            <InputNumber
                              defaultValue={form.getValues(
                                `check.${time}.dosage` as const
                              )} // Lấy giá trị liều lượng từ form
                              min={1}
                              max={10}
                              onChange={
                                (value) =>
                                  form.setValue(`check.${time}.dosage`, value) // Cập nhật giá trị liều lượng
                              }
                            />
                          ) : (
                            ''
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              )}
            </div>
          </div>

          <div className='col-span-12'>
            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Ghi chú </FormLabel>
                  <FormControl>
                    <Textarea {...field}></Textarea>
                    {/* <MultiSelector
                      values={field.value}
                      onValuesChange={(e) => {
                        field.onChange(e);
                        console.log(e);
                      }}
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
                    </MultiSelector> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' ref={submitButtonRef} className='hidden'>
            aaaaaaa
          </Button>
        </div>
      </form>
    </Form>
  );
}
