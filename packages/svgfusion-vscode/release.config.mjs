import packageJson from './package.json' with { type: 'json' };
import config from '../../config/release.config.mjs';

/** @type {import('semantic-release').Options} */
const releaseConfig = config(packageJson.name);

// Override npm plugin config for dual registry support
const npmPluginIndex = releaseConfig.plugins.findIndex(
  plugin => Array.isArray(plugin) && plugin[0] === '@semantic-release/npm'
);

if (npmPluginIndex !== -1) {
  releaseConfig.plugins[npmPluginIndex] = [
    '@semantic-release/npm',
    {
      npmPublish: false,
    },
  ];
}

export default releaseConfig;
