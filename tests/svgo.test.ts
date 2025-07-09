import { describe, it, expect } from 'vitest';
import { createSvgoConfig } from '../src/utils/svgo.js';

describe('createSvgoConfig', () => {
  it('should create default SVGO configuration', () => {
    const config = createSvgoConfig({});
    expect(config).toHaveProperty('plugins');
    expect(Array.isArray(config.plugins)).toBe(true);
  });

  it('should handle removeViewBox option', () => {
    const config = createSvgoConfig({ removeViewBox: true });
    expect(config.plugins).toBeDefined();
    expect(config.plugins?.length).toBeGreaterThan(0);
  });

  it('should handle preserveColors option', () => {
    const config = createSvgoConfig({ preserveColors: true });
    expect(config.plugins).toBeDefined();
    expect(config.plugins?.length).toBeGreaterThan(0);
  });

  it('should handle preserveClasses option', () => {
    const config = createSvgoConfig({ preserveClasses: true });
    expect(config.plugins).toBeDefined();
    expect(config.plugins?.length).toBeGreaterThan(0);
  });

  it('should handle removeDimensions option', () => {
    const config = createSvgoConfig({ removeDimensions: false });
    expect(config.plugins).toBeDefined();
    expect(config.plugins?.length).toBeGreaterThan(0);
  });

  it('should handle multiple options', () => {
    const config = createSvgoConfig({
      removeViewBox: true,
      preserveColors: true,
      preserveClasses: true,
      removeDimensions: false,
    });
    expect(config.plugins).toBeDefined();
    expect(config.plugins?.length).toBeGreaterThan(0);
  });
});
