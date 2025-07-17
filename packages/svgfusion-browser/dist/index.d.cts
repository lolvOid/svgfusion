import { SVGFusionOptions, ConversionResult } from 'svgfusion-core/browser';
export { ConversionResult, SVGFusionOptions } from 'svgfusion-core/browser';
export { ReactGeneratorOptions } from 'svgfusion-react';
export { VueGeneratorOptions } from 'svgfusion-vue';
export { formatComponentName, pascalCase, sanitizeComponentName, svgToComponentName } from 'svgfusion-utils';

/**
 * Browser-compatible SVGFusion API
 * Returns converted component strings instead of writing to files
 */

interface BrowserConversionOptions extends SVGFusionOptions {
    framework: 'react' | 'vue';
    typescript?: boolean;
    componentName?: string;
    prefix?: string;
    suffix?: string;
    splitColors?: boolean;
    splitStrokeWidths?: boolean;
    fixedStrokeWidth?: boolean;
    normalizeFillStroke?: boolean;
    memo?: boolean;
    forwardRef?: boolean;
    sfc?: boolean;
    scriptSetup?: boolean;
    optimize?: boolean;
}
interface BrowserConversionResult extends ConversionResult {
    framework: 'react' | 'vue';
    typescript: boolean;
    dependencies: string[];
    code: string;
    filename: string;
    componentName: string;
    metadata: {
        originalColors: string[];
        originalStrokeWidths: string[];
        optimizationApplied: boolean;
        features: string[];
    };
}
/**
 * Browser-compatible SVGFusion class
 */
declare class SVGFusionBrowser {
    private engine;
    constructor();
    /**
     * Convert SVG content to component string (browser-compatible)
     */
    convert(svgContent: string, options: BrowserConversionOptions): Promise<BrowserConversionResult>;
    /**
     * Extract colors from SVG (browser-compatible)
     */
    extractColors(svgContent: string): string[];
    /**
     * Validate SVG content - focused on XML structure validation only
     */
    validate(svgContent: string): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Basic XML structure validation for critical malformed cases
     */
    private validateXMLStructure;
    /**
     * Fallback validation using regex patterns (for Node.js environment)
     */
    private validateWithRegex;
    /**
     * Convert multiple SVG contents to components (browser-compatible)
     */
    convertBatch(svgContents: Array<{
        content: string;
        name: string;
    }>, options: BrowserConversionOptions): Promise<BrowserConversionResult[]>;
    /**
     * Generate index file content for multiple components (browser-compatible)
     */
    generateIndexFile(results: BrowserConversionResult[], options?: {
        exportType?: 'named' | 'default';
        typescript?: boolean;
    }): string;
    /**
     * Get import path from filename
     */
    private getImportPath;
}
declare function convertToReact(svgContent: string, options?: Omit<BrowserConversionOptions, 'framework'>): Promise<BrowserConversionResult>;
declare function convertToVue(svgContent: string, options?: Omit<BrowserConversionOptions, 'framework'>): Promise<BrowserConversionResult>;
declare function convertBatch(svgContents: Array<{
    content: string;
    name: string;
}>, options: BrowserConversionOptions): Promise<BrowserConversionResult[]>;
declare function extractColors(svgContent: string): string[];
declare function validateSvg(svgContent: string): {
    valid: boolean;
    errors: string[];
};

export { type BrowserConversionOptions, type BrowserConversionResult, SVGFusionBrowser, convertBatch, convertToReact, convertToVue, extractColors, validateSvg };
