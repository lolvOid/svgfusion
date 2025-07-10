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

export { convertToReact } from './core/react-converter.js';
export { convertToVue } from './core/vue-converter.js';
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
