export type {
  ConversionOptions,
  ReactConversionOptions,
  VueConversionOptions,
  ConversionResult,
  BatchConversionOptions,
  BatchConversionResult,
  ConversionError,
  Framework,
  CliOptions,
} from './types/index.js';

export { convertToReact } from './converters/react.js';
export { convertToVue } from './converters/vue.js';
export { optimizeSvg, createSvgoConfig } from './utils/svgo.js';
export {
  readSvgFile,
  writeSvgFile,
  readSvgDirectory,
  writeComponentFile,
} from './utils/files.js';
export {
  svgToComponentName,
  sanitizeComponentName,
  pascalCase,
  formatComponentName,
} from './utils/name.js';
