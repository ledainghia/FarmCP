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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icon } from '@iconify/react/dist/iconify.js';

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
            lưu.
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
                Journalist call this critical, introductory section the and when
                bridge properly executed, it is the that carries your reader
                from anheadine try at attention-grabbing to the body of your
                blog post.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
