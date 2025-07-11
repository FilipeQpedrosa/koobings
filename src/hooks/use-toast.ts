import { useState, useCallback } from 'react';

interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

interface Toast extends ToastProps {
  id: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      ...props,
      duration: props.duration || 5000,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, newToast.duration);

    // For now, just use console.log - in a real app you'd render these
    console.log(`Toast: ${props.title}`, props.description);
    
    return {
      id,
      dismiss: () => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
      },
    };
  }, []);

  return { toast, toasts };
} 