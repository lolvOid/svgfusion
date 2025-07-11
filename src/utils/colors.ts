export type Colors = {
  darkBlue: string;
  mediumBlue: string;
  lightBlue: string;
  blueCyan: string;
  mediumCyan: string;
  darkCyan: string;
  softTeal: string;
  tealGreen: string;
  softGreen: string;
  reset: string;
  cyan: string;
  blue: string;
  green: string;
  red: string;
  gray: string;
  dim: string;
  mediumGreen: string;
};

// ANSI color codes
export const colors = {
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  dim: '\x1b[2m',
  // Bold gradient colors with dramatic artistic accents
  darkBlue: '\x1b[38;2;0;100;255m', // Electric blue (bold)
  mediumBlue: '\x1b[38;2;50;150;255m', // Bright blue
  lightBlue: '\x1b[38;2;100;200;255m', // Vivid sky blue
  blueCyan: '\x1b[38;2;0;150;255m', // Electric blue-cyan
  mediumCyan: '\x1b[38;2;0;255;255m', // Pure cyan (bold)
  darkCyan: '\x1b[38;2;0;200;200m', // Electric turquoise
  softTeal: '\x1b[38;2;0;255;150m', // Electric teal
  tealGreen: '\x1b[38;2;0;200;100m', // Vivid teal green
  softGreen: '\x1b[38;2;50;255;100m', // Electric green
  mediumGreen: '\x1b[38;2;0;255;50m', // Pure green (bold)
  reset: '\x1b[0m',
};
