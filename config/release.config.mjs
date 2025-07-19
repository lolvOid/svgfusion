import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const rootDir = path.resolve(__dirname, '..');

const releaseConfig = name => ({
  branches: [
    'main',
    { name: 'next', prerelease: 'next' },
    { name: 'beta', prerelease: 'beta' },
    { name: 'alpha', prerelease: 'alpha' },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],

    [
      '@semantic-release/exec',
      {
        prepareCmd: [
          `node ${path.join(rootDir, 'scripts/refix-workspace-deps.cjs')} ${name}`,
          `node ${path.join(rootDir, 'scripts/zip-asset.cjs')} ${name}`,
        ].join(' && '),
      },
    ],

    [
      '@semantic-release/npm',
      {
        npmPublish: true,
      },
    ],

    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: `chore(${name}): \${nextRelease.version} [skip ci]\n\n\${nextRelease.notes}`,
      },
    ],

    [
      '@semantic-release/github',
      {
        labels: false,
        releasedLabels: false,
        assets: [
          {
            path: `${name}-*.zip`,
            label: `${name}-\${nextRelease.version}.zip`,
          },
        ],
      },
    ],
  ],
  tagFormat: `${name}@\${version}`,
});

export default releaseConfig;
