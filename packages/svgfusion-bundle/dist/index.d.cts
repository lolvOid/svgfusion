import { SVGFusionOptions, ConversionResult } from 'svgfusion-core';
export * from 'svgfusion-core';
export * from 'svgfusion-react';
export * from 'svgfusion-vue';
export * from 'svgfusion-utils';

declare function convertToReact(svgContent: string, options?: Omit<SVGFusionOptions, 'framework'>): Promise<ConversionResult>;
declare function convertToVue(svgContent: string, options?: Omit<SVGFusionOptions, 'framework'>): Promise<ConversionResult>;

export { convertToReact, convertToVue };
