import { getFileExtension, getComponentFilename } from '../src/utils/files';

describe('getFileExtension', () => {
  it('should return .tsx for React with TypeScript', () => {
    expect(getFileExtension('react', true)).toBe('.tsx');
  });

  it('should return .jsx for React without TypeScript', () => {
    expect(getFileExtension('react', false)).toBe('.jsx');
  });

  it('should return .vue for Vue with TypeScript', () => {
    expect(getFileExtension('vue', true)).toBe('.vue');
  });

  it('should return .vue for Vue without TypeScript', () => {
    expect(getFileExtension('vue', false)).toBe('.vue');
  });

  it('should default to TypeScript when not specified', () => {
    expect(getFileExtension('react')).toBe('.tsx');
    expect(getFileExtension('vue')).toBe('.vue');
  });
});

describe('getComponentFilename', () => {
  it('should generate component filename', () => {
    expect(getComponentFilename('star.svg', 'StarIcon', '.tsx')).toBe(
      'StarIcon.tsx'
    );
    expect(getComponentFilename('user.svg', 'UserProfile', '.vue')).toBe(
      'UserProfile.vue'
    );
  });

  it('should ignore SVG filename parameter', () => {
    expect(getComponentFilename('ignored.svg', 'Icon', '.jsx')).toBe(
      'Icon.jsx'
    );
    expect(getComponentFilename('whatever.svg', 'Component', '.vue')).toBe(
      'Component.vue'
    );
  });

  it('should handle empty component name', () => {
    expect(getComponentFilename('star.svg', '', '.tsx')).toBe('.tsx');
  });

  it('should handle different extensions', () => {
    expect(getComponentFilename('star.svg', 'Star', '.ts')).toBe('Star.ts');
    expect(getComponentFilename('star.svg', 'Star', '.js')).toBe('Star.js');
  });
});
