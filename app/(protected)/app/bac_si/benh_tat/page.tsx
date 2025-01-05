'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { defaultCols } from '@/components/kanban/data';
import KanBanLayout from '@/components/kanban/kanban-layout';
import { StepsProvider } from 'react-step-builder';

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Bác sĩ thú y</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Báo cáo bệnh tật</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardHeader>
      <CardContent>
        <StepsProvider>
          <KanBanLayout defaultCols={defaultCols} />
        </StepsProvider>
      </CardContent>
    </Card>
  );
}
