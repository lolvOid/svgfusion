import { Config } from '@svgr/core';
import { ReactConversionOptions } from '../../types/index.js';

/**
 * Enhanced SVGR configuration generator for complex SVG support
 */
export function createSvgrConfig(options: ReactConversionOptions): Config {
  const {
    typescript = true,
    memo = true,
    ref = true,
    titleProp = true,
    descProp = true,
    icon = true,
    dimensions = false,
    replaceAttrValues = { '#000': 'currentColor', '#000000': 'currentColor' },
    svgProps = {},
    expandProps = false,
    nativeProps = true,
    ariaLabelledBy = false,
    ariaHidden = false,
    role = 'img',
  } = options;

  const config: Config = {
    typescript,
    memo,
    ref,
    titleProp,
    descProp,
    icon,
    dimensions,
    expandProps,
    svgProps: {
      className: '{className}',
      ...(ref && { ref: '{ref}' }),
      ...(nativeProps && {
        width: '{width}',
        height: '{height}',
        style: '{style}',
      }),
      // Accessibility attributes
      ...(ariaLabelledBy &&
        titleProp &&
        descProp && {
          'aria-labelledby': '{titleId} {descId}',
        }),
      ...(ariaHidden && { 'aria-hidden': 'true' }),
      role: role,
      ...svgProps,
    },
    replaceAttrValues,
    plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
  };

  // Enhanced SVGO configuration for complex SVGs
  config.svgoConfig = {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            removeTitle: titleProp ? false : true,
            removeDesc: descProp ? false : true,
            removeUselessStrokeAndFill: false,
            removeUnusedNS: false,
            // Preserve complex features
            removeUselessDefs: false,
            convertShapeToPath: false,
            mergePaths: false,
            convertColors: false, // Disable color conversion to preserve gradients
          },
        },
      },
      ...(icon && !dimensions
        ? [{ name: 'removeAttrs', params: { attrs: ['width', 'height'] } }]
        : []),
      ...(icon ? ['cleanupNumericValues'] : []),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any, // Type assertion to handle SVGO v3 plugin configuration complexity
  };

  return config;
}

/**
 * Post-process SVGR output for enhanced functionality
 */
export function postProcessReactComponent(
  svgrOutput: string,
  componentName: string,
  _options: ReactConversionOptions
): string {
  let processedCode = svgrOutput;

  // Add unique IDs to prevent collisions (always enabled for complex SVGs)
  if (hasComplexFeatures(processedCode)) {
    processedCode = addUniqueIds(processedCode, componentName);
  }

  return processedCode;
}

/**
 * Detect if SVG has complex features that require unique IDs
 */
export function hasComplexFeatures(code: string): boolean {
  const complexFeatures = [
    'linearGradient',
    'radialGradient',
    'pattern',
    'mask',
    'filter',
    'clipPath',
    'marker',
    'symbol',
    'use',
  ];

  return complexFeatures.some(
    feature => code.includes(`<${feature}`) || code.includes(`</${feature}`)
  );
}

/**
 * Add unique IDs to prevent collisions between components
 */
export function addUniqueIds(code: string, componentName: string): string {
  // Generate unique prefix for this component
  const uniquePrefix = `${componentName.toLowerCase()}_`;

  // Replace id attributes
  code = code.replace(/id="([^"]+)"/g, `id="${uniquePrefix}$1"`);

  // Replace url() references
  code = code.replace(/url\(#([^)]+)\)/g, `url(#${uniquePrefix}$1)`);

  // Replace href references
  code = code.replace(/href="#([^"]+)"/g, `href="#${uniquePrefix}$1"`);

  return code;
}
