import { VueConversionOptions, ConversionResult } from '../types/index.js';
import { BaseConverter } from './converter';
import { generateVueComponent } from './processors/vue-processor';
import { extractColors } from '../utils/color-extractor';

/**
 * Vue-specific SVG converter
 */
export class VueConverter extends BaseConverter {
  /**
   * Convert SVG to Vue component
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async convert(
    svgContent: string,
    options: VueConversionOptions = {}
  ): Promise<ConversionResult> {
    try {
      // Process SVG with optimization
      const processedSvg = this.processSvg(svgContent, options);

      // Generate Vue component using processor
      const { code, componentName } = generateVueComponent(
        processedSvg,
        options
      );

      // Generate filename
      const filename = this.generateFilename(
        componentName,
        'vue',
        options.typescript ?? true
      );

      // Extract colors if splitColors is enabled
      const colors = options.splitColors
        ? extractColors(processedSvg).colors
        : undefined;

      return {
        code,
        filename,
        componentName,
        colors,
      };
    } catch (error) {
      throw new Error(`Failed to convert SVG to Vue: ${error}`);
    }
  }
}

/**
 * Convert SVG to Vue component
 */
export async function convertToVue(
  svgContent: string,
  options: VueConversionOptions = {}
): Promise<ConversionResult> {
  const converter = new VueConverter();
  return converter.convert(svgContent, options);
}
