import React, { forwardRef } from 'react';
import { cn } from './cn';

export const Checkbox = forwardRef(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={cn(
      "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", // Custom for native
      "checked:bg-primary checked:text-primary-foreground", // Fallback
      className
    )}
    {...props}
  />
));
