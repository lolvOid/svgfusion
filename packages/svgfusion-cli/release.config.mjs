import packageJson from '../package.json' assert { type: 'json' };
import config from '../../config/release.config.mjs';

/** @type {import('semantic-release').Options} */
const releaseConfig = config(packageJson.name);

export default releaseConfig;
