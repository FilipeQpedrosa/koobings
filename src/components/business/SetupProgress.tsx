'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SetupTask {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export default function SetupProgress() {
  const router = useRouter();
  const [tasks, setTasks] = useState<SetupTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSetupStatus = async () => {
      try {
        const response = await fetch('/api/business/setup-status');
        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks);
        }
      } catch (error) {
        console.error('Error fetching setup status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSetupStatus();
  }, []);

  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  if (isLoading) {
    return <div>Loading setup status...</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Setup Progress</h2>
          <p className="text-sm text-gray-500">Complete these tasks to finish setting up your business</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{completedTasks} of {tasks.length} tasks completed</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start space-x-4 p-4 rounded-lg border"
            >
              {task.isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500 mt-1" />
              )}
              <div className="flex-1">
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
              {!task.isCompleted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/business/onboarding')}
                >
                  Complete
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
} 