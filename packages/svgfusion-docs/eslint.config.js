const rootConfig = require('../../eslint.config.js');

module.exports = [
  ...rootConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
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
