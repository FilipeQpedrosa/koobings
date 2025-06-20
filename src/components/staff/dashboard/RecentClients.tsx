'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  lastVisit: string | null;
}

export function RecentClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch('/api/staff/dashboard/recent-clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClients();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-4 space-y-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {clients.map((client) => (
            <div key={client.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {client.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <p className="text-sm font-medium leading-none">{client.name}</p>
                  {client.lastVisit && (
                    <p className="text-sm text-muted-foreground">
                      Last visit: {formatDistanceToNow(new Date(client.lastVisit), { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>
              <Link href={`/staff/clients/${client.id}`}>
                <Button variant="ghost" size="sm">
                  View Profile
                </Button>
              </Link>
            </div>
          ))}
          {clients.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No recent clients
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 