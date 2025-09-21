import { motion } from 'motion/react';
import type * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  suffix?: React.ReactNode;
}
function Input({ className, type, suffix, ...props }: InputProps) {
  return (
    <motion.div
      className={cn(
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'relative flex border-2 rounded-2xl border-[rgba(var(--sidebar-senconed-rgb),0.5)]',
      )}
    >
      <input
        type={type}
        data-slot='input'
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          'w-[90%] border-none',
          className,
        )}
        {...props}
      />
      <div className='absolute right-3 top-1/2 -translate-y-1/2'>{suffix}</div>
    </motion.div>
  );
}

export { Input };
