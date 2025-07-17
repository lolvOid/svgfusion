const releaseConfig = name => {
  const packageName = name;

  /** @type {import('semantic-release').Options} */
  const config = {
    branches: [
      'main',
      {
        name: '*',
        prerelease: 'beta',
      },
    ],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      [
        '@semantic-release/changelog',
        {
          changelogFile: 'CHANGELOG.md',
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
          assets: [
            'package.json',
            'CHANGELOG.md',
            {
              path: 'dist/**/*',
              label: 'Built distribution',
            },
          ],
          message: `chore(${packageName}): \${nextRelease.version} [skip ci]\n\n\${nextRelease.notes}`,
        },
      ],
      [
        '@semantic-release/github',
        {
          labels: false,
          releasedLabels: false,
        },
      ],
    ],
    tagFormat: `${name}@\${version}`,
    extends: ['semantic-release-monorepo'],
  };

  return config;
};

export default releaseConfig;
