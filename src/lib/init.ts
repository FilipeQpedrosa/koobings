import { SchedulerService } from '@/services/scheduler';

let schedulerService: SchedulerService | null = null;

export function initializeServices() {
  if (!schedulerService) {
    schedulerService = new SchedulerService();
    schedulerService.start();
  }
}

export function shutdownServices() {
  if (schedulerService) {
    schedulerService.stop();
    schedulerService = null;
  }
} 