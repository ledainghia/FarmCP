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
import { PasswordInput } from '@/components/ui/password-input';
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

type Props = {
  onSubmit: (values: z.infer<any>) => void;
  formSchema: z.ZodSchema;
};

export default function AddNewStaffAccountDialog({
  onSubmit,
  formSchema,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'} className='border-dashed w-full mt-2'>
          Thêm mới nhân viên
        </Button>
      </DialogTrigger>
      <DialogContent size='md'>
        <DialogHeader>
          <DialogTitle>Thêm mới nhân viên</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 '>
          <DialogDescription>
            <Form {...form}>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên nhân viên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nguyễn Thị A'
                          type='text'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Nhập tên nhân viên</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-12 gap-4'>
                  <div className='col-span-6'>
                    <FormField
                      control={form.control}
                      name='username'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tài khoản đăng nhập</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='abcasx'
                              type='text'
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Nhập tài khoản đăng nhập của nhân viên
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='col-span-6'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='abc@gmail.com'
                              type='email'
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Nhập mail của nhân viên
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className='grid grid-cols-12 gap-4'>
                  <div className='col-span-6'>
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu</FormLabel>
                          <FormControl>
                            <PasswordInput
                              placeholder='Placeholder'
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Nhập mật khẩu cho tài khoản của nhân viên
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='col-span-6'>
                    <FormField
                      control={form.control}
                      name='rePassword'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nhập lại mật khẩu</FormLabel>
                          <FormControl>
                            <PasswordInput placeholder='' {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-12 gap-4'>
                  <div className='col-span-6'>
                    <FormField
                      control={form.control}
                      name='phoneNumber'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Số điện thoại'
                              type=''
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Nhập số điện thoại của nhân viên
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='col-span-6'>
                    <FormField
                      control={form.control}
                      name='address'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Thủ Đức, TP HCM'
                              type='text'
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Nhập địa chỉ của nhân viên
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
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
