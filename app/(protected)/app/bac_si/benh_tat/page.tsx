'use client';
import TableCustom from '@/components/table/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import KanBanApp from '../../kanban/kanban-app';

import KanBanLayout from '@/components/kanban/kanban-layout';
import { defaultCols } from '@/components/kanban/data';
import { Steps, StepsProvider, useSteps } from 'react-step-builder';
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
