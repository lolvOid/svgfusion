module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'perf',
        'ci',
        'build',
        'revert',
      ],
    ],
    'subject-case': [0], // Allow any case
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 255],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 255],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 255],
  },
};
