import { ConversionResult } from '../types/index.js';

export interface IndexGenerationOptions {
  format: 'ts' | 'js';
  exportType: 'named' | 'default';
  typescript: boolean;
  framework?: 'react' | 'vue';
}

/**
 * Generate index file content for tree-shaking
 */
export function generateIndexFile(
  results: ConversionResult[],
  options: IndexGenerationOptions
): string {
  const { format, exportType, typescript } = options;

  // Sort results by component name for consistent output
  const sortedResults = [...results].sort((a, b) =>
    a.componentName.localeCompare(b.componentName)
  );

  if (exportType === 'default') {
    return generateDefaultExports(sortedResults, format, typescript);
  } else {
    return generateNamedExports(
      sortedResults,
      format,
      typescript,
      options.framework
    );
  }
}

/**
 * Generate named exports for tree-shaking
 */
function generateNamedExports(
  results: ConversionResult[],
  format: 'ts' | 'js',
  typescript: boolean,
  framework?: 'react' | 'vue'
): string {
  let content = '';

  // Add header comment
  content += `// Auto-generated index file for tree-shaking\n`;
  content += `// This file exports all components for optimal bundling\n\n`;

  // Add individual exports
  for (const result of results) {
    const importPath = getImportPath(result.filename, framework);
    content += `export { default as ${result.componentName} } from './${importPath}';\n`;
  }

  // Add TypeScript types export if needed
  if (typescript && format === 'ts') {
    content += `\n// TypeScript component types\n`;

    if (framework === 'vue') {
      content += `export type IconComponent = any;\n`;
    } else {
      // Default to React types
      content += `export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;\n`;
    }

    content += `export type IconComponents = {\n`;
    for (const result of results) {
      content += `  ${result.componentName}: IconComponent;\n`;
    }
    content += `};\n`;
  }

  return content;
}

/**
 * Generate default exports (less tree-shakeable)
 */
function generateDefaultExports(
  results: ConversionResult[],
  _format: 'ts' | 'js',
  _typescript: boolean
): string {
  let content = '';

  // Add header comment
  content += `// Auto-generated index file\n`;
  content += `// Warning: Default exports are less tree-shakeable\n\n`;

  // Import all components
  for (const result of results) {
    const importPath = getImportPath(result.filename);
    content += `import ${result.componentName} from './${importPath}';\n`;
  }

  // Export as object
  content += `\nexport default {\n`;
  for (const result of results) {
    content += `  ${result.componentName},\n`;
  }
  content += `};\n`;

  // Also export individual components for flexibility
  content += `\n// Individual exports for flexibility\n`;
  for (const result of results) {
    content += `export { default as ${
      result.componentName
    } } from './${getImportPath(result.filename)}';\n`;
  }

  return content;
}

/**
 * Get import path from filename
 * For Vue, keep .vue extension; for React, remove extension
 */
function getImportPath(filename: string, framework?: 'react' | 'vue'): string {
  if (framework === 'vue' && filename.endsWith('.vue')) {
    // Keep .vue extension for Vue imports
    return filename;
  }

  // Remove file extension for React imports
  return filename.replace(/\.(tsx?|jsx?|vue)$/, '');
}

/**
 * Generate README content for the generated components
 */
export function generateReadmeContent(results: ConversionResult[]): string {
  const componentNames = results.map(r => r.componentName).sort();

  let content = `# Generated Components\n\n`;
  content += `This directory contains ${results.length} auto-generated components from SVG files.\n\n`;

  content += `## Usage\n\n`;
  content += `### Named imports (recommended for tree-shaking)\n\n`;
  content += `\`\`\`typescript\n`;
  content += `import { ${componentNames
    .slice(0, 3)
    .join(', ')} } from './index';\n`;
  content += `\`\`\`\n\n`;

  content += `### Default import\n\n`;
  content += `\`\`\`typescript\n`;
  content += `import * as Icons from './index';\n`;
  content += `\`\`\`\n\n`;

  content += `## Available Components\n\n`;
  for (const name of componentNames) {
    content += `- \`${name}\`\n`;
  }

  content += `\n## Tree-shaking\n\n`;
  content += `This index file is optimized for tree-shaking. When using named imports, `;
  content += `bundlers like webpack, Rollup, or Vite will only include the components you actually use.\n`;

  return content;
}
