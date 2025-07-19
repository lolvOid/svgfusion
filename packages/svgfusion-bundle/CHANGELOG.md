# [1.29.0](https://github.com/lolvOid/svgfusion/compare/svgfusion@1.28.0...svgfusion@1.29.0) (2025-07-19)

### Features

- **svgfusion-vscode:** implement batch conversion options and update playground UI ([abbb4ce](https://github.com/lolvOid/svgfusion/commit/abbb4ce336a81732d44588b8a20700109a761258))

# [1.28.0](https://github.com/lolvOid/svgfusion/compare/svgfusion@1.27.0...svgfusion@1.28.0) (2025-07-19)

### Features

- **svgfusion-vscode:** enhance SVG conversion with prefix and suffix options, add release configuration ([5494feb](https://github.com/lolvOid/svgfusion/commit/5494feb641c76c2687718bff02d3c62c93d05739))

# [1.27.0](https://github.com/lolvOid/svgfusion/compare/svgfusion@1.26.0...svgfusion@1.27.0) (2025-07-19)

### Features

- svgfusion-extension ([8b301ff](https://github.com/lolvOid/svgfusion/commit/8b301ffcc68ac3d7609feff385dca8dd7500b8fc))

# [svgfusion-v1.26.0](https://github.com/lolvOid/svgfusion/compare/svgfusion@1.25.2...svgfusion@1.26.0) (2025-07-19)

### Features

- add support for semantic-release-monorepo in release configuration ([168a808](https://github.com/lolvOid/svgfusion/commit/168a8086cb49b1fde7b4699ac355ddde63c0d793))

## [1.25.2](https://github.com/lolvOid/svgfusion/compare/svgfusion@1.25.1...svgfusion@1.25.2) (2025-07-19)

### Bug Fixes

- update release:all script to only run release:bundle ([65a6195](https://github.com/lolvOid/svgfusion/commit/65a61952a7954916bd1972e358b82f75f3e25da1))

## [1.25.1](https://github.com/lolvOid/svgfusion/compare/svgfusion@1.25.0...svgfusion@1.25.1) (2025-07-19)

### Bug Fixes

- update package versions for svgfusion-browser, svgfusion-bundle, and svgfusion-cli ([3c299de](https://github.com/lolvOid/svgfusion/commit/3c299de4a5694ad80d8e16d23944590469fa62ab))

# 1.0.0 (2025-07-19)

### Bug Fixes

- add overrides for test files in ESLint configuration ([d01ffa5](https://github.com/lolvOid/svgfusion/commit/d01ffa50aa1de4da1d4def4fe45417fa1d110d13))
- change export syntax from ES6 to CommonJS in release.config.js ([54b216a](https://github.com/lolvOid/svgfusion/commit/54b216a8fc8725151d9c0745b16ee0f8119531f1))
- enhance SVG input handling to support both files and directories" ([a0e7000](https://github.com/lolvOid/svgfusion/commit/a0e7000c2b4d6f1f18c215173dd1eb1a4051eb23))
- improve postinstall script to check for docs directory before installation ([2d08dfb](https://github.com/lolvOid/svgfusion/commit/2d08dfb8b9f17cf2266ae599ffb176d4e4bf0d5f))
- migrate tests from Vitest to Jest and update tsconfig types ([27929a2](https://github.com/lolvOid/svgfusion/commit/27929a2600205851fcb4fd3984ee50166fe8297a))
- preserve SVG tag case in parser and add @types/jsdom ([8a51078](https://github.com/lolvOid/svgfusion/commit/8a510787fb1d461b2cef36081d4d43c50932b850))
- remove --frozen-lockfile option from pnpm install commands ([cdbbb16](https://github.com/lolvOid/svgfusion/commit/cdbbb1663755b77e275ae10fbf5f1972d4fa1f0b))
- remove unnecessary defineOptions call in Vue component snapshots ([b13e95c](https://github.com/lolvOid/svgfusion/commit/b13e95c70dd4ec37d53e0752dd085390eefbbd1f))
- reorganize CI workflow to build and upload documentation artifacts after release ([315347b](https://github.com/lolvOid/svgfusion/commit/315347b34d3443cc9605cd6ad12dd0d37e9e80d0))
- Set default isFixedStrokeWidth and update vectorEffect ([5e27e82](https://github.com/lolvOid/svgfusion/commit/5e27e827da8bfe4f10fbdb24346fe62016ff4f32))
- simplify semantic release branches configuration and clean up plugin options ([6ae59c7](https://github.com/lolvOid/svgfusion/commit/6ae59c7cd262996acfe24bfaec36121a0610aade))
- update build commands in netlify.toml to use pnpm for consistency ([1d9e87e](https://github.com/lolvOid/svgfusion/commit/1d9e87e04309534bcf6e4b8fd82bf38c5227b32e))
- update CI workflow to allow all branches and remove unnecessary build steps ([c30672b](https://github.com/lolvOid/svgfusion/commit/c30672b2d2a71b16a4a9c23c276419eed6f32a84))
- update CI workflow to use --no-frozen-lockfile for dependency installation ([f1c8a9c](https://github.com/lolvOid/svgfusion/commit/f1c8a9c3222425b5676ecb10e4ee430b2b79a1b1))
- update CI/CD workflow permissions and refine branch triggers ([#3](https://github.com/lolvOid/svgfusion/issues/3)) ([95a59f3](https://github.com/lolvOid/svgfusion/commit/95a59f34ca7a91a08c26dc95bb281291039c9bbe))
- update CLI image reference in README and CLI usage documentation ([83225ce](https://github.com/lolvOid/svgfusion/commit/83225ce877d4fb73475b9868469b1502cbe96789))
- Update component name formatting to follow Microsoft .NET guidelines for acronyms and casing ([9de11d1](https://github.com/lolvOid/svgfusion/commit/9de11d17c1b28a7257d822c100dd91a8dacd2b6e))
- Update documentation links and remove obsolete browser API documentation ([8b7136d](https://github.com/lolvOid/svgfusion/commit/8b7136d05e141ff0f281a484827fe354a89da260))
- update example directory paths in CLI integration tests ([5de5f04](https://github.com/lolvOid/svgfusion/commit/5de5f045953cafcd53e1c0da551d343fa583d296))
- update npm version badge in README to use shield style ([665349c](https://github.com/lolvOid/svgfusion/commit/665349c2bbd2e07203420ef958baf4ea77681d01))
- update npm version badge in README to use standard style ([1e4e4b7](https://github.com/lolvOid/svgfusion/commit/1e4e4b7b6e7ddd4f2f2b5d9c0f3a24d5de8f4124))
- update publishConfig to include registry URL and remove repository and bugs fields ([148eca3](https://github.com/lolvOid/svgfusion/commit/148eca38daecf47dbb85288524c5e519f609fed2))
- Update README and package description for clarity; remove obsolete browser API documentation ([189ffc7](https://github.com/lolvOid/svgfusion/commit/189ffc77eeb4d9ab6c7ad34e435e85e75366e110))

### Features

- Add "none" to SVG paths in icon components ([367d87a](https://github.com/lolvOid/svgfusion/commit/367d87a80370d2f107d6e2b625d97b54cf0071fb))
- add accessibility and normalization options to CLI and generator ([24aad3f](https://github.com/lolvOid/svgfusion/commit/24aad3ff2845b4ae9d41f52034b434070f713b07))
- add advanced features with split colors, fixed stroke width, and duplicate validation ([2824b2a](https://github.com/lolvOid/svgfusion/commit/2824b2aa68d856d764ad320131aaa781b4f0abb4))
- add batch conversion for SVG files to React and Vue components ([b1ca079](https://github.com/lolvOid/svgfusion/commit/b1ca07925f331ce17184f196e23e24fab6b3f8d5))
- add CLI banner and color utilities; update README with CLI image ([3589580](https://github.com/lolvOid/svgfusion/commit/35895805ac127deea496b56ef23737ab52b310c3))
- add fill/stroke normalization feature to SVG transformer ([b2967fa](https://github.com/lolvOid/svgfusion/commit/b2967fa935111bd9189ed87e06e2c12fcfd1f4b0))
- Add fixed stroke width toggle ([6356380](https://github.com/lolvOid/svgfusion/commit/6356380054c00cef82c926971da50a374b48062a))
- Add HeartLine icon and improve color handling ([c9c3c80](https://github.com/lolvOid/svgfusion/commit/c9c3c80dad4f2c5d2b4d99ca43b247a8a27587a9))
- add just-pascal-case library for improved component name formatting ([9cb3fbd](https://github.com/lolvOid/svgfusion/commit/9cb3fbd7e30fe814e047d759dfa19d77103cfca7))
- add prefix and suffix options for component name formatting in CLI ([9cc67d0](https://github.com/lolvOid/svgfusion/commit/9cc67d07d8d9ccc144fc671ff58696859a8a1094))
- Add stroke width splitting to icon generators and demos ([729b6ae](https://github.com/lolvOid/svgfusion/commit/729b6ae84c70efb537171d41397d39225bb0a626))
- add watch script and enhance color gradients in CLI output ([a0e604c](https://github.com/lolvOid/svgfusion/commit/a0e604ceb5e2b94c4533f3acf839d67b2a71490c))
- Add width, height, and strokeWidth controls to icon demos ([29c0ae9](https://github.com/lolvOid/svgfusion/commit/29c0ae9f5a3f4d071f2b2a2d0328d6a894dadcfe))
- auto-deploy docs on main branch pushes ([97aaec0](https://github.com/lolvOid/svgfusion/commit/97aaec092f6aa47294748b81dbf0e58e9962a551))
- complete architecture refactor and enhance component generation ([409d979](https://github.com/lolvOid/svgfusion/commit/409d979be8f5b3f5de69fa7ed93ac4e52f408466))
- enhance React and Vue generators to support size prop and improve SVG attribute handling ([fb42c3d](https://github.com/lolvOid/svgfusion/commit/fb42c3d6a95abb77124c7015875ce71c2fa563ae))
- Enhance SEO with metadata, structured data, and robots.txt ([f006db0](https://github.com/lolvOid/svgfusion/commit/f006db040c1a748986303544858f3b0daef5aa51))
- export generateIndexFile and BatchConverter from respective modules ([5f6fbfa](https://github.com/lolvOid/svgfusion/commit/5f6fbfa47847be60089e015d5300640a98de7c31))
- Implement stroke width splitting feature for SVG components ([bfe3194](https://github.com/lolvOid/svgfusion/commit/bfe3194c9dd865029e8365918468053e951e33ea))
- initialize Vue demo project with Vite, Tailwind CSS, and TypeScript ([d301841](https://github.com/lolvOid/svgfusion/commit/d3018411eff881d25185533faea61b6e9bbef995))
- metdata ([1c27930](https://github.com/lolvOid/svgfusion/commit/1c279309ca005bb176aff600defa219c27abe3fb))
- **parser:** enhance SVG parsing with DOMParser and jsdom fallback ([bda8d60](https://github.com/lolvOid/svgfusion/commit/bda8d60269638607b9f94840677ed715d8b0aca0))
- update CLI and engine to improve performance and usability ([64131f4](https://github.com/lolvOid/svgfusion/commit/64131f4d0e0737278cf55825fbf92b4c58f842a4))
- update component naming and default props handling ([f1f1ff6](https://github.com/lolvOid/svgfusion/commit/f1f1ff67201cd3139463c9ccb34ec37217311125))
- update docs ([ee83a59](https://github.com/lolvOid/svgfusion/commit/ee83a595f5a1f5bcbc9f2523fb682da6f68166d3))
- Update README with improved feature list and intro ([736736b](https://github.com/lolvOid/svgfusion/commit/736736be0d15ed2a0050f94e8b603e1c487f56eb))
- version change ([a575f38](https://github.com/lolvOid/svgfusion/commit/a575f388daf67a947ca77cf337dd5ca8a2d40081))

# [1.25.0-beta.1](https://github.com/lolvOid/svgfusion/compare/svgfusion@1.24.2-beta.1...svgfusion@1.25.0-beta.1) (2025-07-19)

### Bug Fixes

- ci ([54f3d29](https://github.com/lolvOid/svgfusion/commit/54f3d29b789fca9d2c77cab38098ca0a90c4ec49))
- downgrade semantic-release to version 24.2.5 and update .gitignore to include dist directory ([e62d9c0](https://github.com/lolvOid/svgfusion/commit/e62d9c045bc847656032e0b55b5ae049839d605b))
- downgrade semantic-release to version 24.2.5 in package.json and pnpm-lock.yaml ([c1bedf8](https://github.com/lolvOid/svgfusion/commit/c1bedf802154a9e0833fc088d9f79e4f4215db6e))
- remove Buy Me a Coffee widget script from Docusaurus config ([2618b14](https://github.com/lolvOid/svgfusion/commit/2618b14ec79b733dc1c914d5b3f48f0c910c7d85))
- remove extends option for semantic-release-monorepo in release config ([7f0dad1](https://github.com/lolvOid/svgfusion/commit/7f0dad1061465ef92d8384217176076e7747ed1a))
- remove unnecessary skip-step parameter from Jest coverage report action ([094f7fe](https://github.com/lolvOid/svgfusion/commit/094f7fea44c4dcd223378003da9f61209de7b378))
- update NODE_AUTH_TOKEN secrets for release jobs and change registry URL to npmjs ([f3879ce](https://github.com/lolvOid/svgfusion/commit/f3879ced57a3fe7f7aa1f466c4669affba31176d))
- update NODE_AUTH_TOKEN to use NPM_TOKEN for beta release ([3045626](https://github.com/lolvOid/svgfusion/commit/304562673375a408f49650686752f349dcba94d9))
- update NODE*AUTH_TOKEN to use NPM_TOKEN* for beta release ([456a24c](https://github.com/lolvOid/svgfusion/commit/456a24cfd7b1a38a75117ab2a3d411a95ba82508))
- update release job conditions to trigger only on main branch and refine beta release step ([7e4c195](https://github.com/lolvOid/svgfusion/commit/7e4c195b00546a088288a9bf02a62fb0731c0eba))

### Features

- add distribution zip creation for svgfusion packages and update release configuration ([03069ab](https://github.com/lolvOid/svgfusion/commit/03069ab8bba00e4e63cd55ff26aa963a9eb2e266))

# [svgfusion-v1.24.2-beta.1](https://github.com/lolvOid/svgfusion/compare/svgfusion@1.24.1...svgfusion@1.24.2-beta.1) (2025-07-18)

### Bug Fixes

- update CI conditions for release jobs and enhance release configuration for better branch handling ([be7d405](https://github.com/lolvOid/svgfusion/commit/be7d405aa00a3705776f5b4ef4e1c10091cd0abf))
- update versioning in package.json files for svgfusion and svgfusion-cli ([9349d05](https://github.com/lolvOid/svgfusion/commit/9349d05f4410f7b27064a5275d61a5945cadba39))

# svgfusion-v1.0.0-refactor.1 (2025-07-17)

### Bug Fixes

- update noExternal entries and add terserOptions for better bundling configuration ([e32d359](https://github.com/lolvOid/svgfusion/commit/e32d359f207c93e386af0fff4fec13f018180b50))
- update package.json import statements in release configuration files for consistency ([e55d4c2](https://github.com/lolvOid/svgfusion/commit/e55d4c26c045ba4aa420709c47852c44d0ddcac4))

### Features

- add browser-specific entry point and component generators for React and Vue ([73e6109](https://github.com/lolvOid/svgfusion/commit/73e6109d5d41100778356873ff246d4599e2c93f))
- enhance svgfusion-cli with TypeScript support and batch processing capabilities ([db3b5d9](https://github.com/lolvOid/svgfusion/commit/db3b5d9902967c58f7a152a04ccfc873b7d7b60b))
- monorepo initial ([8629b78](https://github.com/lolvOid/svgfusion/commit/8629b7879e4100da1c72e6b52bb8123584687062))
- update bundling configuration and add figlet dependency ([bd6a23d](https://github.com/lolvOid/svgfusion/commit/bd6a23d525bfe72efb21fdde349cfe97e66e4ade))
- update CI configuration and package settings for dual registry support and public access ([f873e21](https://github.com/lolvOid/svgfusion/commit/f873e21e58753a989fb101b96e886ea6b0bc4e1c))
- update CLI structure and configuration for improved module handling and entry points ([ba610f2](https://github.com/lolvOid/svgfusion/commit/ba610f280123d74b552760c14c24b67d97a807c3))
- update package versions and enhance bundling configuration ([a430971](https://github.com/lolvOid/svgfusion/commit/a430971f755e87d97753ceea0d46de12bd402f65))

## [1.24.1](https://github.com/lolvOid/svgfusion/compare/v1.24.0...v1.24.1) (2025-07-16)

### Bug Fixes

- update publishConfig to include registry URL and remove repository and bugs fields ([148eca3](https://github.com/lolvOid/svgfusion/commit/148eca38daecf47dbb85288524c5e519f609fed2))

# [1.24.0](https://github.com/lolvOid/svgfusion/compare/v1.23.0...v1.24.0) (2025-07-15)

### Features

- Update README with improved feature list and intro ([736736b](https://github.com/lolvOid/svgfusion/commit/736736be0d15ed2a0050f94e8b603e1c487f56eb))

# [1.23.0](https://github.com/lolvOid/svgfusion/compare/v1.22.0...v1.23.0) (2025-07-15)

### Bug Fixes

- remove --frozen-lockfile option from pnpm install commands ([cdbbb16](https://github.com/lolvOid/svgfusion/commit/cdbbb1663755b77e275ae10fbf5f1972d4fa1f0b))

### Features

- add accessibility and normalization options to CLI and generator ([24aad3f](https://github.com/lolvOid/svgfusion/commit/24aad3ff2845b4ae9d41f52034b434070f713b07))

# [1.22.0](https://github.com/lolvOid/svgfusion/compare/v1.21.1...v1.22.0) (2025-07-14)

### Bug Fixes

- remove unnecessary defineOptions call in Vue component snapshots ([b13e95c](https://github.com/lolvOid/svgfusion/commit/b13e95c70dd4ec37d53e0752dd085390eefbbd1f))

### Features

- add fill/stroke normalization feature to SVG transformer ([b2967fa](https://github.com/lolvOid/svgfusion/commit/b2967fa935111bd9189ed87e06e2c12fcfd1f4b0))

## [1.21.1](https://github.com/lolvOid/svgfusion/compare/v1.21.0...v1.21.1) (2025-07-14)

### Bug Fixes

- preserve SVG tag case in parser and add @types/jsdom ([8a51078](https://github.com/lolvOid/svgfusion/commit/8a510787fb1d461b2cef36081d4d43c50932b850))

# [1.21.0](https://github.com/lolvOid/svgfusion/compare/v1.20.0...v1.21.0) (2025-07-14)

### Features

- **parser:** enhance SVG parsing with DOMParser and jsdom fallback ([bda8d60](https://github.com/lolvOid/svgfusion/commit/bda8d60269638607b9f94840677ed715d8b0aca0))

# [1.20.0](https://github.com/lolvOid/svgfusion/compare/v1.19.0...v1.20.0) (2025-07-14)

### Features

- metdata ([1c27930](https://github.com/lolvOid/svgfusion/commit/1c279309ca005bb176aff600defa219c27abe3fb))

# [1.19.0](https://github.com/lolvOid/svgfusion/compare/v1.18.0...v1.19.0) (2025-07-14)

### Features

- version change ([a575f38](https://github.com/lolvOid/svgfusion/commit/a575f388daf67a947ca77cf337dd5ca8a2d40081))

# [1.18.0](https://github.com/lolvOid/svgfusion/compare/v1.17.0...v1.18.0) (2025-07-13)

### Features

- Add width, height, and strokeWidth controls to icon demos ([85bd1ff](https://github.com/lolvOid/svgfusion/commit/85bd1ff439991200dae2786ec29bb6fe83d2cdaa))

# [1.17.0](https://github.com/lolvOid/svgfusion/compare/v1.16.1...v1.17.0) (2025-07-13)

### Features

- Add stroke width splitting to icon generators and demos ([3546e1a](https://github.com/lolvOid/svgfusion/commit/3546e1a9e3ef723c3ca0b65f69a7f5961b2aff27))

## [1.16.1](https://github.com/lolvOid/svgfusion/compare/v1.16.0...v1.16.1) (2025-07-13)

### Bug Fixes

- Set default isFixedStrokeWidth and update vectorEffect ([3cb3044](https://github.com/lolvOid/svgfusion/commit/3cb3044bd491430c686013c7e97c19cfcf10143e))

# [1.16.0](https://github.com/lolvOid/svgfusion/compare/v1.15.3...v1.16.0) (2025-07-13)

### Features

- update component naming and default props handling ([787d6b6](https://github.com/lolvOid/svgfusion/commit/787d6b6191634631e62921afbaeda39bfef04944))

## [1.15.3](https://github.com/lolvOid/svgfusion/compare/v1.15.2...v1.15.3) (2025-07-13)

### Bug Fixes

- Update component name formatting to follow Microsoft .NET guidelines for acronyms and casing ([e6e87c8](https://github.com/lolvOid/svgfusion/commit/e6e87c8c072d13614e3a31e16e885c0643055ce3))

## [1.15.2](https://github.com/lolvOid/svgfusion/compare/v1.15.1...v1.15.2) (2025-07-13)

### Bug Fixes

- Update README and package description for clarity; remove obsolete browser API documentation ([7663796](https://github.com/lolvOid/svgfusion/commit/76637966f4989584b3c3c3cb0b1bb5cd6b17409b))

## [1.15.1](https://github.com/lolvOid/svgfusion/compare/v1.15.0...v1.15.1) (2025-07-13)

### Bug Fixes

- Update documentation links and remove obsolete browser API documentation ([b96e3bc](https://github.com/lolvOid/svgfusion/commit/b96e3bc91ff1ae396acdd92dcb0414a3791d6b59))

# [1.15.0](https://github.com/lolvOid/svgfusion/compare/v1.14.0...v1.15.0) (2025-07-13)

### Features

- Implement stroke width splitting feature for SVG components ([ac4ca93](https://github.com/lolvOid/svgfusion/commit/ac4ca93cfa21836848b4aea89f59e8081cffadd2))

# [1.14.0](https://github.com/lolvOid/svgfusion/compare/v1.13.0...v1.14.0) (2025-07-12)

### Features

- Add fixed stroke width toggle ([63cc747](https://github.com/lolvOid/svgfusion/commit/63cc7471fa995b9d2a9346d1570b29bc098c2adc))

# [1.13.0](https://github.com/lolvOid/svgfusion/compare/v1.12.0...v1.13.0) (2025-07-12)

### Features

- update docs ([a95522a](https://github.com/lolvOid/svgfusion/commit/a95522a8d8322f1e4eee3abf4bcebfce58cb5d04))

# [1.12.0](https://github.com/lolvOid/svgfusion/compare/v1.11.0...v1.12.0) (2025-07-12)

### Features

- Add "none" to SVG paths in icon components ([80f46f2](https://github.com/lolvOid/svgfusion/commit/80f46f217e85406233dd1840c56c243f524b4241))

# [1.11.0](https://github.com/lolvOid/svgfusion/compare/v1.10.0...v1.11.0) (2025-07-12)

### Features

- Add HeartLine icon and improve color handling ([3b9aaf4](https://github.com/lolvOid/svgfusion/commit/3b9aaf44f14e877a8024d75af6e073d3451470e6))

# [1.10.0](https://github.com/lolvOid/svgfusion/compare/v1.9.0...v1.10.0) (2025-07-12)

### Bug Fixes

- update example directory paths in CLI integration tests ([9089644](https://github.com/lolvOid/svgfusion/commit/9089644f1ee199a86e9363454c0193443be1f1c3))

### Features

- initialize Vue demo project with Vite, Tailwind CSS, and TypeScript ([99e276a](https://github.com/lolvOid/svgfusion/commit/99e276a6cf96e7bee02cf2e283ac4ed6bf9defd6))

# [1.9.0](https://github.com/lolvOid/svgfusion/compare/v1.8.0...v1.9.0) (2025-07-11)

### Features

- enhance React and Vue generators to support size prop and improve SVG attribute handling ([765dd1e](https://github.com/lolvOid/svgfusion/commit/765dd1eddd6cdd680551fd25978e4f8fda1a6151))

# [1.8.0](https://github.com/lolvOid/svgfusion/compare/v1.7.0...v1.8.0) (2025-07-11)

### Features

- complete architecture refactor and enhance component generation ([e8b023e](https://github.com/lolvOid/svgfusion/commit/e8b023e591c3abac80ad6ce785742345c49411d9))
- update CLI and engine to improve performance and usability ([374bfa4](https://github.com/lolvOid/svgfusion/commit/374bfa4a31bf563d239f339dd4600d78b3f1a213))

# [2.0.0](https://github.com/lolvOid/svgfusion/compare/v1.7.0...v2.0.0) (2025-07-12)

## Major Architecture Rewrite

### BREAKING CHANGES

- **Complete internal architecture replacement**: Replaced SVGR/SVGO dependencies with custom SVGFusion engine for better control and reliability
- **API Changes**: Updated programmatic API to use new `SVGFusion` class instead of `convertToReact`/`convertToVue` functions
- **Enhanced Type Safety**: Stricter TypeScript integration with improved type inference

### Features

- **Custom SVGFusion Engine**: Complete rewrite with custom SVG parser and transformation system
- **Native SVG Props Support**: Generated React components extend `React.SVGProps<SVGSVGElement>` for full native prop inheritance
- **Vue Attributes Support**: Generated Vue components extend `SVGAttributes` with `v-bind="$attrs"` for complete attribute coverage
- **Enhanced Performance**: Faster processing with streamlined synchronous architecture
- **Feature-Based Transformations**: Modular transformation system with color-splitting, stroke-fixing, and accessibility features
- **Improved Type Safety**: Better TypeScript integration with proper type definitions and inference
- **Robust Error Handling**: Enhanced error handling and validation throughout the conversion process

### Bug Fixes

- **TypeScript/ESLint Issues**: Resolved all linting issues and improved code quality
- **Async/Sync Consistency**: Converted to synchronous API for simpler usage patterns
- **CLI Improvements**: Enhanced CLI with better error handling and user feedback

### Migration Guide

#### Old API (v1.x)

```typescript
import { convertToReact, convertToVue } from 'svgfusion';

const reactResult = await convertToReact(svgContent, options);
const vueResult = convertToVue(svgContent, options);
```

#### New API (v2.x)

```typescript
import { SVGFusion } from 'svgfusion';

const engine = new SVGFusion();
const reactResult = engine.convert(svgContent, {
  framework: 'react',
  ...options,
});
const vueResult = engine.convert(svgContent, { framework: 'vue', ...options });
```

### Component Output Changes

- **React Components**: Now extend `React.SVGProps<SVGSVGElement>` providing all native SVG element props
- **Vue Components**: Now extend `SVGAttributes` with proper attribute inheritance via `v-bind="$attrs"`
- **Enhanced TypeScript**: Better type inference and native prop support

# [1.7.0](https://github.com/lolvOid/svgfusion/compare/v1.6.0...v1.7.0) (2025-07-11)

### Features

- add advanced features with split colors, fixed stroke width, and duplicate validation ([94c429f](https://github.com/lolvOid/svgfusion/commit/94c429fbf4325b9e42eab9af30b9e18c35b2e986))

# [1.6.0](https://github.com/lolvOid/svgfusion/compare/v1.5.1...v1.6.0) (2025-07-11)

### Features

- export generateIndexFile and BatchConverter from respective modules ([07cbf15](https://github.com/lolvOid/svgfusion/commit/07cbf154c18e9a1ce4d09adeecd43be54ab24e35))

## [1.5.1](https://github.com/lolvOid/svgfusion/compare/v1.5.0...v1.5.1) (2025-07-11)

### Bug Fixes

- update CLI image reference in README and CLI usage documentation ([bccb0bd](https://github.com/lolvOid/svgfusion/commit/bccb0bd4b8108b4387df43270e19fdc588f9833b))

# [1.5.0](https://github.com/lolvOid/svgfusion/compare/v1.4.0...v1.5.0) (2025-07-11)

### Features

- add batch conversion for SVG files to React and Vue components ([8f46391](https://github.com/lolvOid/svgfusion/commit/8f463914d897eba80fe67d6093ab58e6cadf33e0))

# [1.4.0](https://github.com/lolvOid/svgfusion/compare/v1.3.0...v1.4.0) (2025-07-11)

### Features

- add CLI banner and color utilities; update README with CLI image ([13a29a6](https://github.com/lolvOid/svgfusion/commit/13a29a622cbdfa5a7af62f3b027513c2d7840c3b))

# [1.3.0](https://github.com/lolvOid/svgfusion/compare/v1.2.1...v1.3.0) (2025-07-11)

### Features

- add prefix and suffix options for component name formatting in CLI ([5f5a604](https://github.com/lolvOid/svgfusion/commit/5f5a604bb58586673fe7be83abbfb196025e3cd8))

## [1.2.1](https://github.com/lolvOid/svgfusion/compare/v1.2.0...v1.2.1) (2025-07-11)

### Bug Fixes

- update npm version badge in README to use standard style ([68d6df2](https://github.com/lolvOid/svgfusion/commit/68d6df21c296cc3a9445322fde037467466a344c))

# [1.2.0](https://github.com/lolvOid/svgfusion/compare/v1.1.1...v1.2.0) (2025-07-11)

### Features

- add just-pascal-case library for improved component name formatting ([8e7a5ef](https://github.com/lolvOid/svgfusion/commit/8e7a5efbf48b9e36d48d37a441151af77c292a96))

## [1.1.1](https://github.com/lolvOid/svgfusion/compare/v1.1.0...v1.1.1) (2025-07-11)

### Bug Fixes

- update npm version badge in README to use shield style ([9b50a21](https://github.com/lolvOid/svgfusion/commit/9b50a21e49a24180156a6c30fa0e09f5995f01fa))

# [1.1.0](https://github.com/lolvOid/svgfusion/compare/v1.0.7...v1.1.0) (2025-07-11)

### Features

- add watch script and enhance color gradients in CLI output ([de5bfeb](https://github.com/lolvOid/svgfusion/commit/de5bfebf0b536686646a4d1c30edb345f99dd91a))

## [1.0.7](https://github.com/lolvOid/svgfusion/compare/v1.0.6...v1.0.7) (2025-07-11)

### Bug Fixes

- enhance SVG input handling to support both files and directories" ([20a75d9](https://github.com/lolvOid/svgfusion/commit/20a75d95b5b683f9200689e5d55da7220cd07eea))

## [1.0.6](https://github.com/lolvOid/svgfusion/compare/v1.0.5...v1.0.6) (2025-07-11)

### Bug Fixes

- update CI/CD workflow permissions and refine branch triggers ([#3](https://github.com/lolvOid/svgfusion/issues/3)) ([ef7f248](https://github.com/lolvOid/svgfusion/commit/ef7f2488b224233fbd12228f0e781f611de693d9))

## [1.0.5](https://github.com/lolvOid/svgfusion/compare/v1.0.4...v1.0.5) (2025-07-11)

### Bug Fixes

- simplify semantic release branches configuration and clean up plugin options ([87759f2](https://github.com/lolvOid/svgfusion/commit/87759f26d00f6f9205e876eeb97ccbbc9fea5413))

## [1.0.4](https://github.com/lolvOid/svgfusion/compare/v1.0.3...v1.0.4) (2025-07-11)

### Bug Fixes

- update CI workflow to allow all branches and remove unnecessary build steps ([eca96a8](https://github.com/lolvOid/svgfusion/commit/eca96a81d49fe7c1aec9458f7b3435334e4dc265))

## [1.0.3](https://github.com/lolvOid/svgfusion/compare/v1.0.2...v1.0.3) (2025-07-10)

### Bug Fixes

- reorganize CI workflow to build and upload documentation artifacts after release ([8c38616](https://github.com/lolvOid/svgfusion/commit/8c3861630be2d196f6ebee6a5a7cf4dd32046757))

## [1.0.2](https://github.com/lolvOid/svgfusion/compare/v1.0.1...v1.0.2) (2025-07-10)

### Bug Fixes

- add overrides for test files in ESLint configuration ([627a942](https://github.com/lolvOid/svgfusion/commit/627a9427b3d989edcfe2de334456811c991ca99b))
- improve postinstall script to check for docs directory before installation ([db9e933](https://github.com/lolvOid/svgfusion/commit/db9e933a93053e6987614e96ed83cc64ab5dccd1))
- migrate tests from Vitest to Jest and update tsconfig types ([b5a8025](https://github.com/lolvOid/svgfusion/commit/b5a8025197bcc59259b9749e46c34c50ae3acc70))
- update build commands in netlify.toml to use pnpm for consistency ([2f6756b](https://github.com/lolvOid/svgfusion/commit/2f6756bdbfb1a6c77b3e3ca0239627b51d1149ce))
- update CI workflow to use --no-frozen-lockfile for dependency installation ([f0717a3](https://github.com/lolvOid/svgfusion/commit/f0717a38974df446802eb9574c4cdc227df08c71))

## [1.0.1](https://github.com/lolvOid/svgfusion/compare/v1.0.0...v1.0.1) (2025-07-09)

### Bug Fixes

- change export syntax from ES6 to CommonJS in release.config.js ([455805d](https://github.com/lolvOid/svgfusion/commit/455805df8f0422e907a3137f0e0e88932d116342))

# 1.0.0 (2025-07-09)

### Features

- auto-deploy docs on main branch pushes ([38ed861](https://github.com/lolvOid/svgfusion/commit/38ed861eb1734200ae447f2530dbc821d397c840))

# [1.0.0-beta.9](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2025-07-09)

### Features

- update permissions in GitHub workflows and enhance README layout ([076de4c](https://github.com/lolvOid/svgfusion/commit/076de4cf3067e217dea48b29e8052a6ec14a88ce))

# [1.0.0-beta.8](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2025-07-09)

### Features

- Initialize Docusaurus documentation site with essential components and styles ([4356ff1](https://github.com/lolvOid/svgfusion/commit/4356ff16d6579fffe405af58e9af28a3a5e169dc))

# [1.0.0-beta.7](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2025-07-09)

### Features

- enhance CLI with colored ASCII art banner and improved output messages ([4e01450](https://github.com/lolvOid/svgfusion/commit/4e014504e19d97b4478aa08f2e6ebe634ef06511))

# [1.0.0-beta.6](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2025-07-09)

### Features

- add figlet dependency and create ASCII art banner for CLI ([8c409c5](https://github.com/lolvOid/svgfusion/commit/8c409c5719201bcf9727ac6d61c0ab07eaf5a5aa))

# [1.0.0-beta.5](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2025-07-09)

### Features

- update README and package.json ([13027ba](https://github.com/lolvOid/svgfusion/commit/13027ba40f379225648cd0bedbfcd801b10de26f))

# [1.0.0-beta.4](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2025-07-09)

### Features

- add GitHub Action for bundle size reporting on pull requests ([3049b7e](https://github.com/lolvOid/svgfusion/commit/3049b7e79066454ddddb1595347ea8155dc40e53))

# [1.0.0-beta.3](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2025-07-09)

### Features

- add CLI for SVG to React/Vue conversion and configure testing ([1e58863](https://github.com/lolvOid/svgfusion/commit/1e5886398c887f2d989c817d4cf04363bc6d331d))

# [1.0.0-beta.2](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2025-07-09)

### Features

- publish ([13708ee](https://github.com/lolvOid/svgfusion/commit/13708eedd50f7ff14a50efe03696ceb8de11afae))

# 1.0.0-beta.1 (2025-07-09)

### Bug Fixes

- correct build output paths in package.json for npm publishing ([c61c1b1](https://github.com/lolvOid/svgfusion/commit/c61c1b136856b7fbd4ea13b5d3468ddb370169ca))

### Features

- fix husky ([af4fc1e](https://github.com/lolvOid/svgfusion/commit/af4fc1eaacb5a28f117ece6822a15561cadee57a))
- initialize svgfusion project with SVG to React and Vue component conversion ([a02c5f5](https://github.com/lolvOid/svgfusion/commit/a02c5f5d3f643ba75f02d021744e7e153c1935d3))
