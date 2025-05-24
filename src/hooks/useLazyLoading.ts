
import { useState, useEffect } from 'react';
import { preloadComponent } from '@/utils/lazyLoading';
import { logger } from '@/services/logger';

interface UseLazyLoadingOptions {
  preloadOnHover?: boolean;
  preloadDelay?: number;
}

/**
 * Hook for managing lazy loading behavior
 */
export const useLazyLoading = (
  importFn: () => Promise<any>,
  options: UseLazyLoadingOptions = {}
) => {
  const { preloadOnHover = true, preloadDelay = 100 } = options;
  const [isPreloaded, setIsPreloaded] = useState(false);

  const handlePreload = () => {
    if (!isPreloaded) {
      logger.info('Preloading component on hover');
      setTimeout(() => {
        preloadComponent(importFn);
        setIsPreloaded(true);
      }, preloadDelay);
    }
  };

  const preloadProps = preloadOnHover
    ? {
        onMouseEnter: handlePreload,
        onFocus: handlePreload,
      }
    : {};

  return {
    preloadProps,
    isPreloaded,
    preload: handlePreload,
  };
};
