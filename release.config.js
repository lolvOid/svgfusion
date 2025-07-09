// Semantic Release config
const config = () => {
  const packageName = 'svgfusion';

  /** @type {import('semantic-release').Options} */
  const semanticReleaseConfig = {
    branches: [
      'main',
      { name: 'develop', prerelease: 'alpha' },
      { name: 'feature/*', prerelease: true },
      { name: 'hotfix/*', prerelease: 'hotfix' },
    ],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      [
        '@semantic-release/changelog',
        {
          changelogFile: 'CHANGELOG.md'
        }
      ],
      [
        '@semantic-release/npm',
        {
          npmPublish: true
        }
      ],
      [
        '@semantic-release/github',
        {
          assets: [
            {
              path: 'dist/**/*',
              label: 'Built distribution'
            }
          ]
        }
      ],
      [
        '@semantic-release/git',
        {
          assets: [
            'CHANGELOG.md',
            'package.json',
            'package-lock.json'
          ],
          message: `chore(release): \${nextRelease.version} [skip ci]\n\n\${nextRelease.notes}`
        }
      ]
    ]
  };

  return semanticReleaseConfig;
};

module.exports = config();