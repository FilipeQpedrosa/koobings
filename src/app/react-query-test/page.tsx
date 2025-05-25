"use client";
import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

function Example() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['hello'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 500));
      return 'world';
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return <div>Hello {data}</div>;
}

export default function Home() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
} 