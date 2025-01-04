import { cn } from '@/lib/utils';
import React from 'react';

type Step = {
  label: string;
  index: number;
};

type Props = {
  steps: Step[];
  currentStep: number;
};
export default function StepsProgress({ steps, currentStep }: Props) {
  return (
    <div className='flex w-full justify-center items-center  gap-2'>
      <h2 className='sr-only'>Steps</h2>

      <div>
        <ol className={cn('flex items-center gap-2 font-medium  sm:gap-4')}>
          {steps.map((step) => (
            <li
              key={step.index}
              className={cn(
                'flex items-center justify-center gap-2',
                step.index > currentStep ? 'text-gray-400' : ''
              )}
            >
              {currentStep > step.index ? (
                <span className='rounded bg-green-50 p-1.5 '>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='size-3'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              ) : (
                <span
                  className={cn(
                    'size-6 rounded bg-blue-50 text-center   font-bold',
                    step.index > currentStep ? 'text-gray-400' : 'text-gray-600'
                  )}
                >
                  {step.index}
                </span>
              )}

              <span
                className={cn(currentStep > step.index ? 'text-green-600' : '')}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
