import {
  validateDuplicateNames,
  formatDuplicateErrors,
  generateConflictResolutions,
} from 'svgfusion-utils';

describe('Duplicate Name Validation', () => {
  test('should detect no duplicates with unique file names', () => {
    const files = [
      '/path/to/icon1.svg',
      '/path/to/icon2.svg',
      '/path/to/icon3.svg',
    ];

    const result = validateDuplicateNames(files);

    expect(result.hasDuplicates).toBe(false);
    expect(result.duplicates).toEqual([]);
    expect(result.totalFiles).toBe(3);
    expect(result.uniqueNames).toBe(3);
    expect(result).toMatchSnapshot();
  });

  test('should detect duplicates with same file names', () => {
    const files = [
      '/path/to/icon.svg',
      '/another/path/icon.svg',
      '/third/path/icon.svg',
    ];

    const result = validateDuplicateNames(files);

    expect(result.hasDuplicates).toBe(true);
    expect(result.duplicates).toHaveLength(1);
    expect(result.duplicates[0].componentName).toBe('Icon');
    expect(result.duplicates[0].count).toBe(3);
    expect(result.duplicates[0].files).toEqual(files);
    expect(result.totalFiles).toBe(3);
    expect(result.uniqueNames).toBe(1);
    expect(result).toMatchSnapshot();
  });

  test('should detect multiple duplicate groups', () => {
    const files = [
      '/path/to/home.svg',
      '/path/to/settings.svg',
      '/another/path/home.svg',
      '/another/path/settings.svg',
      '/path/to/unique.svg',
    ];

    const result = validateDuplicateNames(files);

    expect(result.hasDuplicates).toBe(true);
    expect(result.duplicates).toHaveLength(2);
    expect(result.totalFiles).toBe(5);
    expect(result.uniqueNames).toBe(3);

    // Check that both Home and Settings are detected as duplicates
    const duplicateNames = result.duplicates.map(d => d.componentName).sort();
    expect(duplicateNames).toEqual(['Home', 'Settings']);
    expect(result).toMatchSnapshot();
  });

  test('should handle prefix and suffix options', () => {
    const files = ['/path/to/icon.svg', '/another/path/icon.svg'];

    const result = validateDuplicateNames(files, {
      prefix: 'My',
      suffix: 'Component',
    });

    expect(result.hasDuplicates).toBe(true);
    expect(result.duplicates[0].componentName).toBe('MyIconComponent');
    expect(result).toMatchSnapshot();
  });

  test('should handle files with different extensions', () => {
    const files = [
      '/path/to/icon.svg',
      '/path/to/icon.SVG',
      '/path/to/different.svg',
    ];

    const result = validateDuplicateNames(files);

    expect(result.hasDuplicates).toBe(true);
    expect(result.duplicates).toHaveLength(1);
    expect(result.duplicates[0].componentName).toBe('Icon');
    expect(result.duplicates[0].count).toBe(2);
    expect(result).toMatchSnapshot();
  });

  test('should handle complex file paths and names', () => {
    const files = [
      '/path/to/my-awesome-icon.svg',
      '/different/path/my_awesome_icon.svg',
      '/another/path/myAwesomeIcon.svg',
    ];

    const result = validateDuplicateNames(files);

    expect(result.hasDuplicates).toBe(true);
    expect(result.duplicates[0].componentName).toBe('MyAwesomeIcon');
    expect(result).toMatchSnapshot();
  });

  test('should format duplicate errors correctly', () => {
    const files = ['/path/to/icon.svg', '/another/path/icon.svg'];

    const result = validateDuplicateNames(files);
    const errorMessage = formatDuplicateErrors(result);

    expect(errorMessage).toContain('Found 1 duplicate component name(s)');
    expect(errorMessage).toContain('Component name "Icon" conflicts');
    expect(errorMessage).toContain('/path/to/icon.svg');
    expect(errorMessage).toContain('/another/path/icon.svg');
    expect(errorMessage).toContain('Please rename the conflicting SVG files');
    expect(errorMessage).toMatchSnapshot();
  });

  test('should return empty string for no duplicates', () => {
    const files = ['/path/to/icon1.svg', '/path/to/icon2.svg'];

    const result = validateDuplicateNames(files);
    const errorMessage = formatDuplicateErrors(result);

    expect(errorMessage).toBe('');
  });

  test('should generate conflict resolutions', () => {
    const files = [
      '/path/to/icon.svg',
      '/another/path/icon.svg',
      '/third/path/icon.svg',
    ];

    const result = validateDuplicateNames(files);
    const resolutions = generateConflictResolutions(result);

    expect(resolutions.size).toBe(1);
    expect(resolutions.has('Icon')).toBe(true);

    const suggestions = resolutions.get('Icon');
    expect(suggestions).toBeDefined();
    expect(suggestions).toEqual(['icon-1.svg', 'icon-2.svg', 'icon-3.svg']);
    expect(resolutions).toMatchSnapshot();
  });

  test('should handle empty file list', () => {
    const files: string[] = [];

    const result = validateDuplicateNames(files);

    expect(result.hasDuplicates).toBe(false);
    expect(result.duplicates).toEqual([]);
    expect(result.totalFiles).toBe(0);
    expect(result.uniqueNames).toBe(0);
    expect(result).toMatchSnapshot();
  });

  test('should handle single file', () => {
    const files = ['/path/to/icon.svg'];

    const result = validateDuplicateNames(files);

    expect(result.hasDuplicates).toBe(false);
    expect(result.duplicates).toEqual([]);
    expect(result.totalFiles).toBe(1);
    expect(result.uniqueNames).toBe(1);
    expect(result).toMatchSnapshot();
  });
});
