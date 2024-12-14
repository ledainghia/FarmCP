'use client';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { ChevronsUpDown } from 'lucide-react';
import React, { useState } from 'react';

type Staff = {
  id: string | number;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  rePassword: string;
};
type StaffProps = {
  staffsList: Staff[];
  className?: string;
};

export default function StaffListAddNew({ staffsList, className }: StaffProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={`space-y-2 ${className}`}
      >
        <div className='flex items-center justify-start space-x-4'>
          <CollapsibleTrigger asChild>
            <Button variant='outline' size='icon'>
              <ChevronsUpDown className='h-4 w-4' />
              <span className='sr-only'>Toggle</span>
            </Button>
          </CollapsibleTrigger>
          <h4 className='text-sm font-semibold'>Danh sách nhân viên tạo mới</h4>
        </div>

        <CollapsibleContent className='space-y-2 border border-gray-200 p-4'>
          {staffsList.length > 0 ? (
            staffsList.map((staff, index) => (
              <>
                <div key={index} className='flex  items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>
                        {index + 1}. {staff.fullName}{' '}
                        <span className='text-xs text-gray-400'>
                          {staff.username} - {staff.email} - {staff.phoneNumber}{' '}
                          - {staff.address}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Button variant='outline' size='icon'>
                      <Icon icon={'tabler:edit'} className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' color='destructive' size='icon'>
                      <Icon
                        icon={'material-symbols:delete-outline'}
                        className='h-4 w-4'
                      />
                    </Button>
                  </div>
                </div>

                {index !== staffsList.length - 1 && <Separator />}
              </>
            ))
          ) : (
            <div>Không có nhân viên nào</div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
