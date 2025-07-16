const rootConfig = require('../../eslint.config.js');

module.exports = [
  ...rootConfig,
  {
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      'build',
      '.docusaurus',
      'static',
    ],
  },
];
