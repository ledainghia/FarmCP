import BarnTable from '@/app/[locale]/(protected)/app/barn/components/barnTable';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export default function Cage() {
  const [isOpen, setIsOpen] = useState(false);
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
          <h4 className='text-sm font-semibold'>
            Danh sách chuồng trại hiện có
          </h4>
        </div>

        <CollapsibleContent className='space-y-2'>
          <BarnTable />
        </CollapsibleContent>
      </Collapsible>
      <Button variant={'outline'} className='border-dashed w-full mt-2'>
        Thêm mới chuồng trại
      </Button>
    </>
  );
}
