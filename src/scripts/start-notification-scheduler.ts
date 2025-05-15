import { NotificationScheduler } from '../lib/services/NotificationScheduler';

async function main() {
  console.log('Starting notification scheduler...');
  
  const scheduler = new NotificationScheduler();
  
  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM signal. Shutting down gracefully...');
    await scheduler.stop();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('Received SIGINT signal. Shutting down gracefully...');
    await scheduler.stop();
    process.exit(0);
  });

  // Start the scheduler
  await scheduler.start();
}

main().catch(error => {
  console.error('Error starting notification scheduler:', error);
  process.exit(1);
}); 