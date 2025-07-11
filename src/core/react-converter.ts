import { transform } from '@svgr/core';
import { ReactConversionOptions, ConversionResult } from '../types/index.js';
import { BaseConverter } from './converter';
import {
  createSvgrConfig,
  postProcessReactComponent,
  hasComplexFeatures,
  addUniqueIds,
} from './processors/svgr-processor';
import { extractColors } from '../utils/color-extractor';

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

      // Extract colors BEFORE processing if splitColors is enabled
      const colors = options.splitColors
        ? extractColors(svgContent).colors
        : undefined;

      // Process SVG with optimization
      let processedSvg = this.processSvg(svgContent, options);

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
        options,
        colors
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
        colors,
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
