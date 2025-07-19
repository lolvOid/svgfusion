// Direct re-exports - all from core
export * from 'svgfusion-core';

// Direct re-exports - all from framework generators
export * from 'svgfusion-react';
export * from 'svgfusion-vue';

// Direct re-exports - all from Node.js utilities
export * from 'svgfusion-utils';

// Import only what we need for convenience functions
import { ConversionResult, SVGFusion, SVGFusionOptions } from 'svgfusion-core';
import { ReactGenerator } from 'svgfusion-react';
import { VueGenerator } from 'svgfusion-vue';

// Export convenience functions
export async function convertToReact(
  svgContent: string,
  options: Omit<SVGFusionOptions, 'framework'> = {}
): Promise<ConversionResult> {
  const fusion = new SVGFusion();
  return fusion.convert(
    svgContent,
    { ...options, framework: 'react' },
    ReactGenerator
  );
}

export async function convertToVue(
  svgContent: string,
  options: Omit<SVGFusionOptions, 'framework'> = {}
): Promise<ConversionResult> {
  const fusion = new SVGFusion();
  return fusion.convert(
    svgContent,
    { ...options, framework: 'vue' },
    VueGenerator
  );
}
