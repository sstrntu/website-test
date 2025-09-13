import { AppConfig } from '../types';

/**
 * Detects device capabilities and returns performance configuration.
 */
export function detectPerformance(): AppConfig {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowEnd = navigator.hardwareConcurrency <= 4 || isMobile;
  
  return {
    performanceMode: isLowEnd ? 'low' : 'high',
    isMobile,
    isLowEnd,
    effectsEnabled: !isLowEnd
  };
}

/**
 * Gets optimized settings based on performance mode.
 */
export function getPerformanceSettings(config: AppConfig) {
  if (config.isLowEnd) {
    return {
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      antialias: false,
      shadows: false,
      postProcessing: false,
      particleCount: {
        dust: 80,
        stars: 800,
        smallStars: 1000,
        lightDots: 500
      }
    };
  }

  return {
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    antialias: true,
    shadows: true,
    postProcessing: true,
    particleCount: {
      dust: 200,
      stars: 2000,
      smallStars: 2500,
      lightDots: 1200
    }
  };
}