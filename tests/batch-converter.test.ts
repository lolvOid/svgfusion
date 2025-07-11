import { BatchConversionOptions } from '../src/types/index';
import { validateDuplicateNames } from '../src/utils/duplicate-validator';

describe('BatchConverter Options', () => {
  test('should support splitColors and isFixedStrokeWidth options', () => {
    // Test that BatchConversionOptions interface supports the new options
    const options: BatchConversionOptions = {
      inputDir: '/mock/input',
      outputDir: '/mock/output',
      framework: 'react',
      splitColors: true,
      isFixedStrokeWidth: true,
      typescript: true,
      generateIndex: false,
    };

    // Verify the options are properly typed and accessible
    expect(options.splitColors).toBe(true);
    expect(options.isFixedStrokeWidth).toBe(true);
    expect(options.framework).toBe('react');
    expect(options.typescript).toBe(true);

    // Snapshot test for options structure
    expect(options).toMatchSnapshot();
  });

  test('should have optional splitColors and isFixedStrokeWidth properties', () => {
    // Test that the options are optional (can be undefined)
    const minimalOptions: BatchConversionOptions = {
      inputDir: '/mock/input',
      outputDir: '/mock/output',
      framework: 'vue',
    };

    expect(minimalOptions.splitColors).toBeUndefined();
    expect(minimalOptions.isFixedStrokeWidth).toBeUndefined();

    // Snapshot test for minimal options structure
    expect(minimalOptions).toMatchSnapshot();
  });

  test('should support all framework options with split colors', () => {
    const reactOptions: BatchConversionOptions = {
      inputDir: '/test/input',
      outputDir: '/test/output',
      framework: 'react',
      splitColors: true,
      isFixedStrokeWidth: true,
      typescript: true,
      generateIndex: true,
      indexFormat: 'ts',
      exportType: 'named',
      prefix: 'Icon',
      suffix: 'Component',
      optimize: true,
    };

    const vueOptions: BatchConversionOptions = {
      inputDir: '/test/input',
      outputDir: '/test/output',
      framework: 'vue',
      splitColors: true,
      isFixedStrokeWidth: false,
      typescript: false,
      generateIndex: true,
      indexFormat: 'js',
      exportType: 'default',
      recursive: true,
      extensions: ['.svg', '.SVG'],
    };

    // Snapshot test for full React options
    expect(reactOptions).toMatchSnapshot();

    // Snapshot test for full Vue options
    expect(vueOptions).toMatchSnapshot();
  });

  test('should validate duplicate names before processing', () => {
    const duplicateFiles = [
      '/path/to/icon.svg',
      '/another/path/icon.svg',
      '/third/path/icon.svg',
    ];

    const result = validateDuplicateNames(duplicateFiles);

    expect(result.hasDuplicates).toBe(true);
    expect(result.duplicates).toHaveLength(1);
    expect(result.duplicates[0].componentName).toBe('Icon');
    expect(result.duplicates[0].count).toBe(3);
    expect(result).toMatchSnapshot();
  });

  test('should handle batch conversion with prefix and suffix affecting duplicates', () => {
    const files = [
      '/path/to/home.svg',
      '/path/to/settings.svg',
      '/another/path/home.svg',
    ];

    const options: BatchConversionOptions = {
      inputDir: '/mock/input',
      outputDir: '/mock/output',
      framework: 'react',
      prefix: 'App',
      suffix: 'Icon',
    };

    const result = validateDuplicateNames(files, {
      prefix: options.prefix,
      suffix: options.suffix,
    });

    expect(result.hasDuplicates).toBe(true);
    expect(result.duplicates[0].componentName).toBe('AppHomeIcon');
    expect(result).toMatchSnapshot();
  });
});
