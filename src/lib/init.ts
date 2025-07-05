// import { SchedulerService } from '@/services/scheduler';

let schedulerService: any | null = null;

export function initializeServices() {
  // Temporarily disabled to fix chunk loading error
  console.log('Services initialization skipped');
  // if (!schedulerService) {
  //   schedulerService = new SchedulerService();
  //   schedulerService.start();
  // }
}

export function shutdownServices() {
  if (schedulerService) {
    schedulerService.stop();
    schedulerService = null;
  }
} 