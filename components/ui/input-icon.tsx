import * as React from 'react';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input, type InputProps as InputProps2 } from './input';

interface InputProps extends InputProps2 {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
}

const InputIcon = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;
    return (
      <div className='w-full h-full relative'>
        {StartIcon && (
          <div className='absolute left-1.5 top-1/2 transform -translate-y-1/2'>
            <StartIcon size={18} className='text-muted-foreground' />
          </div>
        )}
        {/* <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background py-2 px-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            startIcon ? "pl-8" : "",
            endIcon ? "pr-8" : "",
            className
          )}
          ref={ref}
          {...props}
        /> */}
        <Input
          type={type}
          className={cn(startIcon ? 'pl-8' : '', endIcon ? 'pr-8' : '')}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            <EndIcon className='text-muted-foreground' size={18} />
          </div>
        )}
      </div>
    );
  }
);

InputIcon.displayName = 'InputIcon';

export { InputIcon };
