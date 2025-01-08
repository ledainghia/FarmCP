'use client';

import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Command as CommandPrimitive } from 'cmdk';
import { X as RemoveIcon, Check } from 'lucide-react';
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from 'react';

interface SingleSelectorProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  value: string | undefined;
  onValueChange: (value: string | null) => void;
  loop?: boolean;
}

interface SingleSelectContextProps {
  value: string | null | undefined;
  onValueChange: (value: string | null) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

const SingleSelectContext = createContext<SingleSelectContextProps | null>(
  null
);

const useSingleSelect = () => {
  const context = useContext(SingleSelectContext);
  if (!context) {
    throw new Error('useSingleSelect must be used within SingleSelectProvider');
  }
  return context;
};

const SingleSelector = ({
  value,
  onValueChange,
  loop = false,
  className,
  children,
  dir,
  ...props
}: SingleSelectorProps) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState<boolean>(false);

  const onValueChangeHandler = useCallback(
    (val: string | null) => {
      if (value === val) {
        onValueChange(null);
      } else {
        onValueChange(val);
      }
    },
    [value, onValueChange]
  );

  return (
    <SingleSelectContext.Provider
      value={{
        value,
        onValueChange: onValueChangeHandler,
        open,
        setOpen,
        inputValue,
        setInputValue,
      }}
    >
      <Command
        className={cn(
          'overflow-visible z-[9999999999999999] bg-transparent flex flex-col space-y-2',
          className
        )}
        dir={dir}
        {...props}
      >
        {children}
      </Command>
    </SingleSelectContext.Provider>
  );
};

const SingleSelectorTrigger = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { value, onValueChange } = useSingleSelect();

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-wrap gap-1 p-1 py-2 ring-1 ring-muted rounded-lg bg-background',
        className
      )}
      {...props}
    >
      {value && (
        <Badge
          className='px-1 rounded-sm flex items-center gap-1'
          variant={'outline'}
          color={'primary'}
        >
          <span className='text-xs'>{value}</span>
          <button
            aria-label={`Remove ${value} option`}
            aria-roledescription='button to remove option'
            type='button'
            onMouseDown={mousePreventDefault}
            onClick={() => onValueChange(null)}
          >
            <span className='sr-only'>Remove {value} option</span>
            <RemoveIcon className='h-4 w-4 hover:stroke-destructive' />
          </button>
        </Badge>
      )}
      {children}
    </div>
  );
});

SingleSelectorTrigger.displayName = 'SingleSelectorTrigger';

const SingleSelectorInput = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  const { setOpen, inputValue, setInputValue } = useSingleSelect();

  return (
    <CommandPrimitive.Input
      {...props}
      ref={ref}
      value={inputValue}
      onValueChange={(value) => setInputValue(value || '')}
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      className={cn(
        'ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1',
        className
      )}
    />
  );
});

SingleSelectorInput.displayName = 'SingleSelectorInput';

const SingleSelectorContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children }, ref) => {
  const { open } = useSingleSelect();
  return (
    <div ref={ref} className='relative'>
      {open && children}
    </div>
  );
});

SingleSelectorContent.displayName = 'SingleSelectorContent';

const SingleSelectorList = forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children }, ref) => {
  return (
    <CommandList
      ref={ref}
      className={cn(
        'p-2 flex flex-col gap-2 rounded-md scrollbar-thin z-[9999999999999999] scrollbar-track-transparent transition-colors scrollbar-thumb-muted-foreground dark:scrollbar-thumb-muted scrollbar-thumb-rounded-lg w-full absolute bg-background shadow-md  border border-muted top-0',
        className
      )}
    >
      {children}
      <CommandEmpty>
        <span className='text-muted-foreground'>Không tìm thấy</span>
      </CommandEmpty>
    </CommandList>
  );
});

SingleSelectorList.displayName = 'SingleSelectorList';

const SingleSelectorItem = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  { value: string } & React.ComponentPropsWithoutRef<
    typeof CommandPrimitive.Item
  >
>(({ className, value, children, ...props }, ref) => {
  const {
    value: selectedValue,
    onValueChange,
    setInputValue,
  } = useSingleSelect();
  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const isIncluded = selectedValue === value;
  return (
    <CommandItem
      ref={ref}
      {...props}
      onSelect={() => {
        onValueChange(value);
        setInputValue('');
      }}
      className={cn(
        'rounded-md cursor-pointer px-2 py-1 transition-colors flex justify-between',
        className,
        isIncluded && 'opacity-50 cursor-not-allowed hidden',
        props.disabled && 'opacity-50 cursor-not-allowed'
      )}
      onMouseDown={mousePreventDefault}
    >
      {children}
      {isIncluded && <Check className='h-4 w-4' />}
    </CommandItem>
  );
});

SingleSelectorItem.displayName = 'SingleSelectorItem';

export {
  SingleSelector,
  SingleSelectorTrigger,
  SingleSelectorInput,
  SingleSelectorContent,
  SingleSelectorList,
  SingleSelectorItem,
};
