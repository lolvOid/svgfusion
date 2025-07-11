import { ConversionOptions, ConversionResult } from '../types/index.js';
import { optimizeSvg } from '../utils/svgo';
import { formatComponentName } from '../utils/name';

/**
 * Base converter class for SVG to framework conversion
 */
export abstract class BaseConverter {
  /**
   * Process SVG content with optimization
   */
  protected processSvg(svgContent: string, options: ConversionOptions): string {
    const { optimize = true } = options;

    if (optimize) {
      return optimizeSvg(svgContent);
    }

    return svgContent;
  }

  /**
   * Generate component name from options
   */
  protected generateComponentName(options: ConversionOptions): string {
    const { name, prefix, suffix } = options;
    const baseName = name || 'Icon';
    return formatComponentName(baseName, prefix, suffix);
  }

  /**
   * Generate filename for component
   */
  protected generateFilename(
    componentName: string,
    framework: 'react' | 'vue',
    typescript: boolean = true
  ): string {
    try {
      // Try Node.js file utilities first
      const {
        getFileExtension,
        getComponentFilename,
      } = require('../utils/files.js');
      const extension = getFileExtension(framework, typescript);
      return getComponentFilename('icon.svg', componentName, extension);
    } catch {
      // Fallback for environments without Node.js utilities
      const extensions = {
        react: typescript ? '.tsx' : '.jsx',
        vue: '.vue',
      };
      return `${componentName}${extensions[framework]}`;
    }
  }

  /**
   * Abstract method to convert SVG to framework component
   */
  abstract convert(
    svgContent: string,
    options: ConversionOptions
  ): Promise<ConversionResult>;
}
