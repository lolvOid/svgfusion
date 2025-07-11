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
} from './types/index';

export { convertToReact } from './core/react-converter';
export { convertToVue } from './core/vue-converter';
export { optimizeSvg, createSvgoConfig } from './utils/svgo';
export {
  readSvgFile,
  writeSvgFile,
  readSvgDirectory,
  writeComponentFile,
} from './utils/files';
export {
  svgToComponentName,
  sanitizeComponentName,
  pascalCase,
  formatComponentName,
} from './utils/name';
