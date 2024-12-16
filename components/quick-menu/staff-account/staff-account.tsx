'use client';
import React, { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../ui/collapsible';
import { Button } from '../../ui/button';
import { ChevronsUpDown } from 'lucide-react';
import UsersTable from '@/app/(protected)/app/users/components/usersTables';
import AddNewStaffAccountDialog from './addNewStaffAccount';
import { z } from 'zod';
import toast from 'react-hot-toast';
import StaffListAddNew from './staffListAddNew';

export default function StaffAccount() {
  const [isOpen, setIsOpen] = useState(false);
  const [staffs, setStaffs] = useState<z.infer<typeof formSchema>[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const formSchema: z.ZodSchema = z
    .object({
      fullName: z.string({ message: 'Tên không được để trống' }),
      username: z.string({ message: 'Tên đăng nhập không được để trống' }),
      email: z.string({ message: 'Email không được để trống' }),
      phoneNumber: z.string({ message: 'Số điện thoại không được để trống' }),
      address: z.string({ message: 'Địa chỉ không được để trống' }),
      password: z.string({ message: 'Mật khẩu không được để trống' }),
      rePassword: z.string({
        message: 'Nhập lại mật khẩu không được để trống',
      }),
    })
    .superRefine((values, ctx) => {
      if (values.password !== values.rePassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mật khẩu không khớp',
          path: ['rePassword'],
        });
      }

      if (staffs.some((staff) => staff.username === values.username)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tên đăng nhập đã tồn tại',
          path: ['username'],
        });
      }
    });

  function onSubmit(values: z.infer<typeof formSchema>, reset: () => void) {
    try {
      console.log(values);
      if (staffs.some((staff) => staff.username === values.username)) {
        console.log('Tên đăng nhập đã tồn tại');

        return;
      }
      if (values) setStaffs([...staffs, values]);
      toast('Thêm nhân viên thành công', {
        icon: '👏',
        position: 'top-right',
      });
      setOpenDialog(false);
      reset();
    } catch (error) {
      console.error('Form submission error', error);
    }
  }
  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className=' space-y-2'
      >
        <div className='flex items-center justify-start space-x-4'>
          <CollapsibleTrigger asChild>
            <Button variant='outline' size='icon'>
              <ChevronsUpDown className='h-4 w-4' />
              <span className='sr-only'>Toggle</span>
            </Button>
          </CollapsibleTrigger>
          <h4 className='text-sm font-semibold'>Danh sách nhân viên hiện có</h4>
        </div>

        <CollapsibleContent className='space-y-2'>
          <UsersTable addNew={false} />
        </CollapsibleContent>
      </Collapsible>
      {staffs && staffs.length > 0 && (
        <StaffListAddNew className='mt-2' staffsList={staffs} />
      )}

      <AddNewStaffAccountDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onSubmit={onSubmit}
        formSchema={formSchema}
      />
    </>
  );
}
