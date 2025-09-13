import { describe, it, expect, vi, beforeEach } from 'vitest';
import { detectPerformance, getPerformanceSettings } from '../../src/utils/performance';

describe('Performance Utils', () => {
  beforeEach(() => {
    // Reset navigator mock
    vi.clearAllMocks();
  });

  describe('detectPerformance', () => {
    it('should detect high-end desktop configuration', () => {
      // Mock high-end desktop
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true
      });
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 8,
        configurable: true
      });

      const config = detectPerformance();

      expect(config.isMobile).toBe(false);
      expect(config.isLowEnd).toBe(false);
      expect(config.performanceMode).toBe('high');
      expect(config.effectsEnabled).toBe(true);
    });

    it('should detect mobile device configuration', () => {
      // Mock mobile device
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
        configurable: true
      });
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 4,
        configurable: true
      });

      const config = detectPerformance();

      expect(config.isMobile).toBe(true);
      expect(config.isLowEnd).toBe(true);
      expect(config.performanceMode).toBe('low');
      expect(config.effectsEnabled).toBe(false);
    });

    it('should detect low-end device by CPU cores', () => {
      // Mock low-end device
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true
      });
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 2,
        configurable: true
      });

      const config = detectPerformance();

      expect(config.isMobile).toBe(false);
      expect(config.isLowEnd).toBe(true);
      expect(config.performanceMode).toBe('low');
      expect(config.effectsEnabled).toBe(false);
    });
  });

  describe('getPerformanceSettings', () => {
    it('should return high-end settings for powerful devices', () => {
      const config = {
        performanceMode: 'high' as const,
        isMobile: false,
        isLowEnd: false,
        effectsEnabled: true
      };

      const settings = getPerformanceSettings(config);

      expect(settings.antialias).toBe(true);
      expect(settings.shadows).toBe(true);
      expect(settings.postProcessing).toBe(true);
      expect(settings.particleCount.stars).toBe(2000);
      expect(settings.pixelRatio).toBeLessThanOrEqual(2);
    });

    it('should return low-end settings for weak devices', () => {
      const config = {
        performanceMode: 'low' as const,
        isMobile: true,
        isLowEnd: true,
        effectsEnabled: false
      };

      const settings = getPerformanceSettings(config);

      expect(settings.antialias).toBe(false);
      expect(settings.shadows).toBe(false);
      expect(settings.postProcessing).toBe(false);
      expect(settings.particleCount.stars).toBe(800);
      expect(settings.pixelRatio).toBeLessThanOrEqual(1.5);
    });

    it('should cap pixel ratio appropriately', () => {
      const highConfig = {
        performanceMode: 'high' as const,
        isMobile: false,
        isLowEnd: false,
        effectsEnabled: true
      };

      const lowConfig = {
        performanceMode: 'low' as const,
        isMobile: true,
        isLowEnd: true,
        effectsEnabled: false
      };

      // Mock high DPI display
      Object.defineProperty(window, 'devicePixelRatio', {
        value: 3,
        configurable: true
      });

      const highSettings = getPerformanceSettings(highConfig);
      const lowSettings = getPerformanceSettings(lowConfig);

      expect(highSettings.pixelRatio).toBe(2); // Capped at 2
      expect(lowSettings.pixelRatio).toBe(1.5); // Capped at 1.5
    });
  });
});