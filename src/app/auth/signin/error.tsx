'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container mx-auto flex h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg p-6 space-y-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
        <p className="mb-4 text-muted-foreground">{error.message}</p>
        <Button onClick={() => reset()} className="w-full">Try again</Button>
      </Card>
    </div>
  );
} 