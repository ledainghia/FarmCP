'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button'; // Import Button từ shadcn
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Minus, Plus } from 'lucide-react';

export interface InputNumberProps {
  min?: number;
  max?: number;
  disabled?: boolean;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      min = 0,
      max,
      defaultValue = 0,
      disabled = false,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState(defaultValue);

    const handleMinus = (e: React.MouseEvent) => {
      e.preventDefault();
      if (value > min) {
        const newValue = value - 1;
        setValue(newValue);
        onChange?.(newValue);
      }
    };

    const handlePlus = (e: React.MouseEvent) => {
      e.preventDefault();
      if (max === undefined || value < max) {
        const newValue = value + 1;
        setValue(newValue);
        onChange?.(newValue);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
      if (isNaN(newValue)) newValue = min;
      if (newValue < min) newValue = min;
      if (max !== undefined && newValue > max) newValue = max;

      setValue(newValue);
      onChange?.(newValue);
    };

    return (
      <div className={cn('flex items-center flex-1', className)} {...props}>
        <Button
          variant='outline'
          size='md'
          onClick={handleMinus}
          disabled={value <= min || disabled}
          className='rounded-r-none !px-2'
        >
          <Minus className='h-4 w-4' />
        </Button>
        <Input
          type='text'
          value={value}
          disabled={disabled}
          onChange={handleInputChange}
          className={cn(
            'w-20 text-center border border-input bg-background !rounded-none text-base focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
        />
        <Button
          variant='outline'
          size='md'
          onClick={handlePlus}
          className='rounded-l-none !px-2'
          disabled={(max !== undefined && value >= max) || disabled}
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>
    );
  }
);

InputNumber.displayName = 'InputNumber';

export { InputNumber };
