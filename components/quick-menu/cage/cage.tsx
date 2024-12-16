import BarnTable from '@/app/(protected)/app/barn/components/barnTable';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import AddNewCageCageDialog from './addNewCage';
import { z } from 'zod';
import toast from 'react-hot-toast';
import CageListAddNew from './cageListAddNew';

export default function Cage() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [cages, setCages] = useState<z.infer<typeof formSchema>[]>([]);
  const formSchema = z.object({
    name: z.string(),
    area: z.preprocess(
      (value) => (value ? Number(value) : undefined),
      z.number().positive('Diện tích phải là số dương')
    ),
    capacity: z.preprocess(
      (value) => (value ? Number(value) : undefined),
      z.number().positive('Sức chứa phải là số dương')
    ),
    location: z.string(),
    animalType: z.string(),
  });

  function onSubmit(values: z.infer<typeof formSchema>, reset: () => void) {
    try {
      console.log(values);

      toast('Thêm nhân viên thành công', {
        icon: '👏',
        position: 'top-right',
      });
      if (values) setCages([...cages, values]);
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
          <h4 className='text-sm font-semibold'>
            Danh sách chuồng trại hiện có
          </h4>
        </div>

        <CollapsibleContent className='space-y-2'>
          <BarnTable addNew={false} />
        </CollapsibleContent>
      </Collapsible>
      {cages && cages.length > 0 && (
        <CageListAddNew cageList={cages} className='mt-3' />
      )}

      <AddNewCageCageDialog
        formSchema={formSchema}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onSubmit={onSubmit}
      />
    </>
  );
}
