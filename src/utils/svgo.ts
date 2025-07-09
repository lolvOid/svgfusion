import { optimize, Config } from 'svgo';

/**
 * Default SVGO configuration for optimization
 */
const defaultConfig: Config = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeTitle: false,
          removeDesc: false,
          removeUselessStrokeAndFill: false,
          convertColors: {
            currentColor: true,
            names2hex: true,
            rgb2hex: true,
            shorthex: true, // cspell:disable-line
            shortname: true,
          },
        },
      },
    },
    'removeDimensions',
    'cleanupNumericValues',
  ],
};

/**
 * Optimize SVG content using SVGO
 * @param svgContent - SVG content to optimize
 * @param config - Optional SVGO configuration
 * @returns Optimized SVG content
 */
export function optimizeSvg(
  svgContent: string,
  config: Config = defaultConfig
): string {
  try {
    const result = optimize(svgContent, config);
    return result.data;
  } catch (error) {
    throw new Error(`Failed to optimize SVG: ${error}`);
  }
}

/**
 * Create custom SVGO configuration
 * @param options - Configuration options
 * @returns SVGO configuration
 */
export function createSvgoConfig(options: {
  removeViewBox?: boolean;
  removeDimensions?: boolean;
  removeTitle?: boolean;
  removeDesc?: boolean;
  preserveAspectRatio?: boolean;
  preserveColors?: boolean;
  preserveClasses?: boolean;
}): Config {
  const plugins = [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: !options.removeViewBox,
          removeTitle: !options.removeTitle,
          removeDesc: !options.removeDesc,
          removeUselessStrokeAndFill: !options.preserveClasses,
          convertColors: options.preserveColors
            ? false
            : {
                currentColor: true,
                names2hex: true,
                rgb2hex: true,
                shorthex: true, // cspell:disable-line
                shortname: true,
              },
        },
      },
    },
    'cleanupNumericValues',
  ];

  if (options.removeDimensions !== false) {
    plugins.push('removeDimensions');
  }

  return { plugins: plugins as Config['plugins'] };
}
