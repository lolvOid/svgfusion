import { basename, extname } from 'node:path';
import { formatComponentName } from './name';

/**
 * Information about a duplicate name conflict
 */
export interface DuplicateNameInfo {
  componentName: string;
  files: string[];
  count: number;
}

/**
 * Result of duplicate name validation
 */
export interface DuplicateValidationResult {
  hasDuplicates: boolean;
  duplicates: DuplicateNameInfo[];
  totalFiles: number;
  uniqueNames: number;
}

/**
 * Validate for duplicate component names in a list of SVG files
 */
export function validateDuplicateNames(
  svgFiles: string[],
  options: {
    prefix?: string;
    suffix?: string;
  } = {}
): DuplicateValidationResult {
  const { prefix = '', suffix = '' } = options;
  const nameMap = new Map<string, string[]>();

  // Generate component names for each file
  for (const filePath of svgFiles) {
    const filename = basename(filePath, extname(filePath));
    const componentName = formatComponentName(filename, prefix, suffix);

    if (!nameMap.has(componentName)) {
      nameMap.set(componentName, []);
    }
    const files = nameMap.get(componentName);
    if (files) {
      files.push(filePath);
    }
  }

  // Find duplicates
  const duplicates: DuplicateNameInfo[] = [];
  for (const [componentName, files] of nameMap.entries()) {
    if (files.length > 1) {
      duplicates.push({
        componentName,
        files,
        count: files.length,
      });
    }
  }

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
    totalFiles: svgFiles.length,
    uniqueNames: nameMap.size,
  };
}

/**
 * Format duplicate validation errors for display
 */
export function formatDuplicateErrors(
  validationResult: DuplicateValidationResult
): string {
  if (!validationResult.hasDuplicates) {
    return '';
  }

  const { duplicates, totalFiles } = validationResult;
  let errorMessage = `Found ${duplicates.length} duplicate component name(s) in ${totalFiles} files:\n\n`;

  for (const duplicate of duplicates) {
    errorMessage += `⚠️  Component name "${duplicate.componentName}" conflicts:\n`;
    for (const file of duplicate.files) {
      errorMessage += `   - ${file}\n`;
    }
    errorMessage += '\n';
  }

  errorMessage +=
    'Please rename the conflicting SVG files or use different prefix/suffix options to avoid conflicts.';

  return errorMessage;
}

/**
 * Generate suggested file names to resolve conflicts
 */
export function generateConflictResolutions(
  validationResult: DuplicateValidationResult
): Map<string, string[]> {
  const resolutions = new Map<string, string[]>();

  for (const duplicate of validationResult.duplicates) {
    const suggestions: string[] = [];

    // Generate numbered suggestions
    for (let i = 0; i < duplicate.files.length; i++) {
      const originalFile = duplicate.files[i];
      const filename = basename(originalFile, extname(originalFile));
      const numberedName = `${filename}-${i + 1}${extname(originalFile)}`;
      suggestions.push(numberedName);
    }

    resolutions.set(duplicate.componentName, suggestions);
  }

  return resolutions;
}
