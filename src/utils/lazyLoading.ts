
import { lazy, ComponentType } from 'react';
import { logger } from '@/services/logger';

/**
 * Enhanced lazy loading utility with error handling and logging
 */
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
) => {
  logger.info(`Setting up lazy loading for component: ${componentName}`);
  
  return lazy(async () => {
    try {
      logger.info(`Loading component: ${componentName}`);
      const module = await importFn();
      logger.info(`Successfully loaded component: ${componentName}`);
      return module;
    } catch (error) {
      logger.error(`Failed to load component: ${componentName}`, { error });
      throw error;
    }
  });
};

/**
 * Preload a lazy component
 */
export const preloadComponent = (importFn: () => Promise<any>) => {
  importFn().catch((error) => {
    logger.error('Failed to preload component', { error });
  });
};
