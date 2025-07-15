export interface ConversionOptions {
  name?: string;
  prefix?: string;
  suffix?: string;
  optimize?: boolean;
  typescript?: boolean;
  format?: 'esm' | 'cjs';
  splitColors?: boolean;
  splitStrokeWidths?: boolean;
  fixedStrokeWidth?: boolean;
  normalizeFillStroke?: boolean;
  accessibility?: boolean;
  removeComments?: boolean;
  removeDuplicates?: boolean;
  minifyPaths?: boolean;
  // Legacy support
  isFixedStrokeWidth?: boolean;
}

export interface ReactConversionOptions extends ConversionOptions {
  memo?: boolean;
  ref?: boolean;
  titleProp?: boolean;
  descProp?: boolean;
  // Advanced SVG handling options
  icon?: boolean;
  dimensions?: boolean;
  replaceAttrValues?: Record<string, string>;
  svgProps?: Record<string, string>;
  expandProps?: boolean | 'start' | 'end';
  // Native SVG props support
  nativeProps?: boolean;
  // Accessibility options
  ariaLabelledBy?: boolean;
  ariaHidden?: boolean;
  role?: 'img' | 'graphics-document' | 'graphics-symbol' | 'presentation';
}

export interface VueConversionOptions extends ConversionOptions {
  compositionApi?: boolean;
  scriptSetup?: boolean;
  // Advanced SVG handling options
  props?: boolean;
  dimensions?: boolean;
  replaceAttrValues?: Record<string, string>;
}

export interface ConversionResult {
  code: string;
  filename: string;
  componentName: string;
  colors?: string[];
}

export interface BatchConversionOptions extends ConversionOptions {
  inputDir: string;
  outputDir: string;
  recursive?: boolean;
  extensions?: string[];
  generateIndex?: boolean;
  indexFormat?: 'ts' | 'js';
  exportType?: 'named' | 'default';
  framework?: Framework;
}

export interface BatchConversionResult {
  results: ConversionResult[];
  errors: ConversionError[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

export interface ConversionError {
  file: string;
  error: string;
  stack?: string;
}

export type Framework = 'react' | 'vue';
