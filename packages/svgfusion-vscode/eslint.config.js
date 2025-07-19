const rootConfig = require('../../eslint.config.js');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  ...rootConfig,
  {
    ignores: ['dist', 'node_modules', 'coverage', 'media', '*.vsix'],
  },
];
