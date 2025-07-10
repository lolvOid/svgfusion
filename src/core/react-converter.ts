import { transform } from '@svgr/core';
import { ReactConversionOptions, ConversionResult } from '../types/index.js';
import { BaseConverter } from './converter.js';
import {
  createSvgrConfig,
  postProcessReactComponent,
  hasComplexFeatures,
  addUniqueIds,
} from './processors/svgr-processor.js';

/**
 * React-specific SVG converter
 */
export class ReactConverter extends BaseConverter {
  /**
   * Convert SVG to React component using SVGR
   */
  async convert(
    svgContent: string,
    options: ReactConversionOptions = {}
  ): Promise<ConversionResult> {
    try {
      // Generate component name first (needed for ID collision prevention)
      const componentName = this.generateComponentName(options);

      // Process SVG with optimization
      let processedSvg = await this.processSvg(svgContent, options);

      // Add unique IDs to prevent collisions BEFORE SVGR processing
      if (hasComplexFeatures(processedSvg)) {
        processedSvg = addUniqueIds(processedSvg, componentName);
      }

      // Create SVGR configuration
      const svgrConfig = createSvgrConfig(options);

      // Transform SVG to React component using SVGR
      const svgrResult = await transform(processedSvg, svgrConfig, {
        componentName,
      });

      // Post-process the SVGR output
      const code = postProcessReactComponent(
        svgrResult,
        componentName,
        options
      );

      // Generate filename
      const filename = this.generateFilename(
        componentName,
        'react',
        options.typescript ?? true
      );

      return {
        code,
        filename,
        componentName,
      };
    } catch (error) {
      throw new Error(`Failed to convert SVG to React: ${error}`);
    }
  }
}

/**
 * Convert SVG to React component
 */
export async function convertToReact(
  svgContent: string,
  options: ReactConversionOptions = {}
): Promise<ConversionResult> {
  const converter = new ReactConverter();
  return converter.convert(svgContent, options);
}
