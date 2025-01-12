import { InputColor } from '@/lib/type';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Eye, EyeOff, Lock, LucideIcon, LucideProps } from 'lucide-react';
import * as React from 'react';

export const inputVariants = cva(
  ' w-full  bg-background  rounded py-2 px-3 h-9 border text-sm font-normal border border-solid border-default-200 outline-none focus:outline-none  file:border-0 file:bg-transparent file:text-sm file:font-medium read-only:bg-default-200 disabled:cursor-not-allowed disabled:opacity-50  transition-all duration-300 ',
  {
    variants: {
      color: {
        default:
          'border-default-200 text-default-500 focus:outline-none focus:border-default dark:focus:border-default-500 disabled:bg-default-200  dark:disabled:bg-default-500  placeholder:text-accent-foreground/50',
        primary:
          'border-primary/50 text-primary focus:border-primary disabled:bg-primary/30 disabled:placeholder:text-primary  placeholder:text-primary/70',
        secondary:
          'border-default-300 text-default-700  focus:border-secondary  disabled:bg-secondary/30 disabled:placeholder:text-secondary  placeholder:text-default-600',
        info: 'border-info/50 text-info focus:border-info  disabled:bg-info/30 disabled:placeholder:text-info  placeholder:text-info/70',
        warning:
          'border-warning/50 text-warning  focus:border-warning disabled:bg-warning/30 disabled:placeholder:text-info  placeholder:text-warning/70',
        success:
          'border-success/50 text-success focus:border-success   disabled:bg-success/30 disabled:placeholder:text-info  placeholder:text-success/70',
        destructive:
          'border-destructive/50 text-destructive focus:border-destructive  disabled:bg-destructive/30 disabled:placeholder:text-destructive  placeholder:text-destructive/70',
      },

      size: {
        sm: 'h-8 text-xs read-only:leading-8',
        default: 'h-9 text-xs read-only:leading-none',
        md: 'h-10 text-sm read-only:leading-10',
        lg: 'h-12  text-sm read-only:leading-[48px]',
      },
    },

    defaultVariants: {
      color: 'default',
      size: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  iconProps?: LucideProps;
  color?: InputColor;
  size?: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon,
      endIcon,
      size,
      color,
      iconProps = {},
      ...props
    },
    ref
  ) => {
    const [show, setShow] = React.useState(false);
    const StartIcon = startIcon;
    const EndIcon = endIcon;
    const { className: iconClassName, ...iconRest } = iconProps;

    if (type === 'password') {
      return (
        <div className='w-full h-9 relative'>
          <div className='absolute left-1.5 top-1/2 transform -translate-y-1/2'>
            <Lock
              size={18}
              className={cn('text-muted-foreground', iconClassName)}
              {...iconRest}
            />
          </div>
          <input
            autoComplete='off'
            type={!show ? type : 'text'}
            className={cn(inputVariants({ color, size }), className)}
            ref={ref}
            {...props}
          />
          <button
            onClick={() => setShow((prev) => !prev)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2'
            type='button'
          >
            {show ? (
              <Eye className='stroke-slate-700/70' size={18} />
            ) : (
              <EyeOff className='stroke-slate-700/70' size={18} />
            )}
          </button>
        </div>
      );
    }

    return (
      <div className='w-full h-9 relative'>
        {StartIcon && (
          <div className='absolute left-1.5 top-1/2 transform -translate-y-1/2'>
            <StartIcon
              size={18}
              className={cn('text-muted-foreground', iconClassName)}
              {...iconRest}
            />
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ color, size }),
            startIcon ? 'pl-8' : '',
            endIcon ? 'pr-8' : '',
            className
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            <EndIcon
              className={cn('text-muted-foreground', iconClassName)}
              {...iconRest}
              size={18}
            />
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
