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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useAnimalsTemplatesQuery } from '@/hooks/use-query';
import { AnimalsTemplateDTO } from '@/dtos/AnimalsTemplateDTO';
import { farmsApi } from '@/config/api';
import toast from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Tên là mục bắt buộc' }),
  cageId: z.string().optional(),
  templateId: z.string().min(1, { message: 'Mẫu vật nuôi là mục bắt buộc' }),
  species: z.string().min(1, { message: 'Loài là mục bắt buộc' }),
  cleaningFrequency: z
    .number()
    .min(1, { message: 'Tần suất vệ sinh phải lớn hơn 0' }),
  quantity: z.number().min(1, { message: 'Số lượng phải lớn hơn 0' }),
});

type Props = {
  cageID: string;
  cageName: string;
};

export default function AddFarmingBatchDialog({ cageID, cageName }: Props) {
  const clientQuery = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { data: animalsTemplates } = useAnimalsTemplatesQuery();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cageId: cageName,
    },
  });

  const addNewFarmingBatch = useMutation({
    mutationFn: (data: any) => farmsApi.createFarmingBatch(data),
    onSuccess: () => {
      clientQuery.invalidateQueries({
        queryKey: ['farmingBatch', cageID],
      });
      clientQuery.invalidateQueries({
        queryKey: ['cages'],
      });
      setIsDialogOpen(false);
      form.reset();
      toast.success(`Thêm vụ nuôi mới cho chuồng ${cageName} thành công`);
    },
    onError(erorr: any) {
      toast.error(
        erorr.response?.data?.result?.message ||
          'Đã xảy ra lỗi! Vui lòng kiểm tra lại'
      );
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const submitValues = {
      ...values,
      cageId: cageID,
    };
    addNewFarmingBatch.mutate(submitValues);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size='md'>Thêm vụ nuôi mới cho chuồng {cageName} </Button>
      </DialogTrigger>
      <DialogContent size='md'>
        <DialogHeader className='mb-4'>
          <DialogTitle> Thêm vụ nuôi mới cho chuồng {cageName} </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tên vụ nuôi</FormLabel>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                  <FormDescription>Nhập tên của vụ nuôi</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='species'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Loài vật nuôi </FormLabel>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                  <FormDescription>Nhập tên của loài vật nuôi</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='templateId'
              render={({ field }) => (
                <FormItem className='flex flex-col w-full'>
                  <FormLabel required={true}>Chọn mẫu vật nuôi</FormLabel>
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
                            {(animalsTemplates &&
                              animalsTemplates.items.find(
                                (template: AnimalsTemplateDTO) =>
                                  template.id === field.value
                              )?.name) ??
                              'Chọn mẫu vật nuôi'}
                          </span>
                          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className={cn(`w-[43vw] p-0`)}>
                      <Command>
                        <CommandInput placeholder='Tìm kiếm mẫu vật nuôi...' />
                        <CommandList>
                          <CommandEmpty>
                            Không tìm thấy mẫu nào phù hợp!
                          </CommandEmpty>
                          <CommandGroup>
                            {animalsTemplates?.items
                              .filter((item) => {
                                return item.status === 'Active';
                              })
                              .map((template: AnimalsTemplateDTO) => (
                                <CommandItem
                                  value={template.name}
                                  key={template.id}
                                  onSelect={() => {
                                    field.onChange(template.id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      template.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {template.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Chọn mẫu vật nuôi để áp dụng vào vụ nuôi
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='cleaningFrequency'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Tần suất vệ sinh </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          onChange={(event) => {
                            field.onChange(Number(event.target.value));
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Nhập tần suất vệ sinh cho vụ nuôi
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='quantity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Số lượng</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=''
                          type='number'
                          {...field}
                          onChange={(event) => {
                            field.onChange(Number(event.target.value));
                          }}
                        />
                      </FormControl>
                      <FormDescription>Nhập số lượng </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className='flex justify-end gap-2 pt-6'>
              <Button
                type='reset'
                variant={'outline'}
                onClick={(e) => {
                  e.preventDefault();

                  form.reset();
                  form.setValue('cageId', cageName);
                  form.setValue('templateId', '');
                  form.setValue('cleaningFrequency', 1);
                  form.setValue('quantity', 1);
                  form.setValue('species', '');
                  form.setValue('name', '');
                }}
                className='font-bold'
              >
                Đặt lại
              </Button>
              <Button
                type='submit'
                disabled={addNewFarmingBatch.isPending ? true : false}
                className='font-bold'
              >
                {addNewFarmingBatch.isPending ? 'Đang thêm...' : 'Thêm mới'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
