'use client';
import Cage from '@/components/quick-menu/cage/cage';
import StaffAccount from '@/components/quick-menu/staff-account/staff-account';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Icon } from '@iconify/react/dist/iconify.js';
import BarnTable from '../../barn/components/barnTable';
import AssignCage from '@/components/quick-menu/assign-cage/assignCage';

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Cấu hình và thiết lập</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tài khoản và chuồng trại</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardHeader>
      <CardContent>
        {/* <TableCustom
          title='Quản lí danh sách vác-xin'
          data={data}
          columns={columns}
        ></TableCustom> */}
        <Alert variant='soft' color='warning'>
          <AlertDescription className='!text-base'>
            <Icon icon='heroicons-outline:exclamation' className='w-5 h-5' />{' '}
            Bạn hãy chắc chắn rằng tất cả dữ liệu bạn nhập chính xác trước khi
            lưu. <br /> Dữ liệu bạn nhập và lưu chỉ là tạm thời cho tới khi bạn
            xác nhận hoành thành quy trình
          </AlertDescription>
        </Alert>

        <div className='full w-full flex justify-start mt-4'>
          {/* <div className='flex-1'>Nhân viên</div>`
          <Separator className='' /> */}
          <Accordion type='multiple' className='w-full'>
            <AccordionItem value='item-1'>
              <AccordionTrigger>Tài khoản nhân viên</AccordionTrigger>
              <AccordionContent>
                <StaffAccount />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
              <AccordionTrigger>Chuồng trại</AccordionTrigger>
              <AccordionContent>
                <Cage />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
              <AccordionTrigger>Phân công công việc</AccordionTrigger>
              <AccordionContent>
                <AssignCage />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
      <CardFooter className='flex justify-end'>
        <div className='flex justify-end'>
          <Button>Lưu quy trình</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
