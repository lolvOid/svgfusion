import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const rootConfig = require('../../eslint.config.js');

export default [
  ...rootConfig,
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },
];
