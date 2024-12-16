'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { PasswordInput } from '@/components/ui/password-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type Props = {
  onSubmit: (values: z.infer<any>, reset: () => void) => void;
  formSchema: z.ZodSchema;
  openDialog: boolean;
  setOpenDialog: (value: boolean) => void;
};

export default function AddNewCageCageDialog({
  onSubmit,
  formSchema,
  openDialog,
  setOpenDialog,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values, form.reset); // Truyền form.reset vào hàm onSubmit
  };
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={'outline'} className='border-dashed w-full mt-2'>
          Thêm mới chuồng trại
        </Button>
      </DialogTrigger>
      <DialogContent size='md'>
        <DialogHeader>
          <DialogTitle> Thêm mới chuồng trại</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6 '>
          <DialogDescription>
            <Form {...form}>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên chuồng</FormLabel>
                      <FormControl>
                        <Input placeholder='' type='text' {...field} />
                      </FormControl>

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
                          <FormLabel>Diện tích</FormLabel>
                          <FormControl>
                            <Input placeholder='' type='number' {...field} />
                          </FormControl>

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
                          <FormLabel>Sức chứa</FormLabel>
                          <FormControl>
                            <Input placeholder='' type='' {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name='location'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vị trí</FormLabel>
                      <FormControl>
                        <Input placeholder='' type='' {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='animalType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại động vật</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='m@example.com'>
                            m@example.com
                          </SelectItem>
                          <SelectItem value='m@google.com'>
                            m@google.com
                          </SelectItem>
                          <SelectItem value='m@support.com'>
                            m@support.com
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' color='warning'>
                Close
              </Button>
            </DialogClose>

            <Button type='submit'>Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
