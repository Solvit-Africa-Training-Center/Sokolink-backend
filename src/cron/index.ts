import cron from 'node-cron';
import { checkProductStock } from './checkProductStock';
import { logger } from '../utils/logger';

export const initCronJobs = ():void => {
  // Run daily at 12:00 PM (noon)
  cron.schedule('0 12 * * *', async () => {
    logger.info('[Cron] Executing scheduled stock check job');
    await checkProductStock();
  }, {
    timezone: "UTC"
  });
  
  logger.info('[Cron] Job scheduled to run daily at 12:00 PM');
};
