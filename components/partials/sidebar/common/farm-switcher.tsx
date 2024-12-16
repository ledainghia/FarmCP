'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { ChevronsUpDown, Check, CirclePlus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useConfig } from '@/hooks/use-config';
import { useMediaQuery } from '@/hooks/use-media-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenuHoverConfig } from '@/hooks/use-menu-hover';
import { useFarmsQuery } from '@/hooks/use-query';
import { getUserID } from '@/utils/getUserID';
import { FarmDTO } from '@/dtos/FarmDTO';
import farmStore from '@/config/zustandStore/farmStore';
import { far } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { set } from 'lodash';

const groups = [
  {
    label: 'Nông trại',
    teams: [
      {
        label: 'Nông trại nuôi bò',
        value: 'personal',
      },
    ],
  },
];

type Team = (typeof groups)[number]['teams'][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function FarmSwitcher({ className }: TeamSwitcherProps) {
  const [config] = useConfig();
  const [hoverConfig] = useMenuHoverConfig();
  const { hovered } = hoverConfig;
  const { data } = useFarmsQuery(getUserID());
  const { setFarm } = farmStore();

  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedFarm, setSelectedFarm] = React.useState<FarmDTO>();

  React.useEffect(() => {
    if (data?.items && data.items.length > 0) {
      setSelectedFarm(data.items[0]);
      setFarm(data.items[0]);
    }
  }, [data]);

  const isDesktop = useMediaQuery('(min-width: 1280px)');
  if (config.showSwitcher === false || config.sidebar === 'compact')
    return null;

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <motion.div
            key={config.collapsed && !hovered ? 'collapsed' : 'expanded'}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {config.collapsed && !hovered ? (
              <Button
                variant='outline'
                color='secondary'
                role='combobox'
                fullWidth
                aria-expanded={open}
                aria-label='Select a team'
                className={cn(
                  '  h-14 w-14 mx-auto  p-0 md:p-0  dark:border-secondary ring-offset-sidebar',
                  className
                )}
              >
                {/* <Avatar className="">
                                <AvatarImage
                                    height={24}
                                    width={24}
                                    src={session?.user?.image as any}
                                    alt={selectedTeam.label}
                                    className="grayscale"
                                />

                                <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar> */}
              </Button>
            ) : (
              <Button
                variant='outline'
                color='secondary'
                role='combobox'
                fullWidth
                aria-expanded={open}
                aria-label='Select a team'
                className={cn(
                  '  h-auto py-3 md:px-3 px-3 justify-start dark:border-secondary ring-offset-sidebar',
                  className
                )}
              >
                <div className=' flex  gap-2 flex-1 items-center'>
                  {/* <Avatar className=' flex-none h-[38px] w-[38px]'>
                    <AvatarImage
                      height={38}
                      width={38}
                      src={session?.user?.image as any}
                      alt={selectedTeam.label}
                      className='grayscale'
                    />

                    <AvatarFallback>
                      {session?.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar> */}
                  <div className='flex-1 text-start w-[100px]'>
                    <div className='text-sm  font-semibold text-default-900 dark:text-default-700 truncate '>
                      {selectedFarm?.name}
                    </div>
                  </div>
                  <div className=''>
                    <ChevronsUpDown className='ml-auto h-5 w-5 shrink-0  text-default-500 dark:text-default-700' />
                  </div>
                </div>
              </Button>
            )}
          </motion.div>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandList>
              <CommandInput
                placeholder='Tìm kiếm nông trại...'
                className=' placeholder:text-xs'
              />
              <CommandEmpty>Không tìm thấy nông trại!</CommandEmpty>

              <CommandGroup heading='Nông trại'>
                {data?.items &&
                  Array.isArray(data.items) &&
                  data.items.map((farm) => (
                    <CommandItem
                      key={farm.id}
                      onSelect={() => {
                        setSelectedFarm(farm);
                        setFarm(farm);
                        setOpen(false);
                      }}
                      className='text-sm font-normal'
                    >
                      {farm.name}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedFarm?.name === farm.id
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  );
}
