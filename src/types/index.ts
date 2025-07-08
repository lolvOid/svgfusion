export interface ConversionOptions {
  name?: string;
  prefix?: string;
  suffix?: string;
  optimize?: boolean;
  typescript?: boolean;
  format?: 'esm' | 'cjs';
}

export interface ReactConversionOptions extends ConversionOptions {
  memo?: boolean;
  ref?: boolean;
  titleProp?: boolean;
  descProp?: boolean;
}

export interface VueConversionOptions extends ConversionOptions {
  compositionApi?: boolean;
  scriptSetup?: boolean;
}

export interface ConversionResult {
  code: string;
  filename: string;
  componentName: string;
}

export interface BatchConversionOptions extends ConversionOptions {
  inputDir: string;
  outputDir: string;
  recursive?: boolean;
  extensions?: string[];
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

export interface CliOptions {
  framework: Framework;
  input: string;
  output?: string;
  name?: string;
  prefix?: string;
  suffix?: string;
  optimize?: boolean;
  typescript?: boolean;
  format?: 'esm' | 'cjs';
  recursive?: boolean;
  verbose?: boolean;
}
