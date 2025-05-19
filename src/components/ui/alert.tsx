import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface AlertProps {
  children: ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
}

export function Alert({ children, variant = 'default', className = '' }: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-md border p-4',
        variant === 'destructive'
          ? 'border-red-500 bg-red-50 text-red-800'
          : 'border-gray-200 bg-gray-50 text-gray-800',
        className
      )}
      role={variant === 'destructive' ? 'alert' : undefined}
    >
      {children}
    </div>
  );
}

export function AlertDescription({ children }: { children: ReactNode }) {
  return <div className="mt-1 text-sm">{children}</div>;
}

export default Alert; 