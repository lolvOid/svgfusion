import { VueConversionOptions, ConversionResult } from '../types/index.js';
import { BaseConverter } from './converter.js';
import { generateVueComponent } from './processors/vue-processor.js';

/**
 * Vue-specific SVG converter
 */
export class VueConverter extends BaseConverter {
  /**
   * Convert SVG to Vue component
   */
  async convert(
    svgContent: string,
    options: VueConversionOptions = {}
  ): Promise<ConversionResult> {
    try {
      // Process SVG with optimization
      const processedSvg = await this.processSvg(svgContent, options);

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

      return {
        code,
        filename,
        componentName,
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
