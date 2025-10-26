import React, { forwardRef } from 'react';
import { cn } from './cn';
import { Card } from './Card';

export const Dialog = ({ children, open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="fixed inset-0" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-lg">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = forwardRef(({ className, children, ...props }, ref) => (
  <Card ref={ref} className={cn("w-full", className)} {...props}>
    {children}
  </Card>
));

export const DialogHeader = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>
);

export const DialogTitle = ({ children, className }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>{children}</h3>
);

export const DialogFooter = ({ children, className }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0", className)}>
    {children}
  </div>
);
