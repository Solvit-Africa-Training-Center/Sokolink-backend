import { errorLogger } from '../utils/logger';
import { logger } from '../utils/logger';
import { Product } from '../services/productService';

export const checkProductStock = async (): Promise<void> => {
  try {
    logger.info('[Cron:checkProductStock] Starting stock check');
    await Product.checkStock();
    logger.info('[Cron:checkProductStock] Completed successfully');
  } catch (error) {
    errorLogger(error as Error, `[Cron:checkProductStock] Failed: ${(error as Error).message}`);
  }
};

export default checkProductStock;
