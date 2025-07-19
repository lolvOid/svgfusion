## [1.0.2](https://github.com/lolvOid/svgfusion/compare/svgfusion-cli@1.0.1...svgfusion-cli@1.0.2) (2025-07-19)


### Bug Fixes

* update package versions for svgfusion-browser, svgfusion-bundle, and svgfusion-cli ([3c299de](https://github.com/lolvOid/svgfusion/commit/3c299de4a5694ad80d8e16d23944590469fa62ab))

# 1.0.0-beta.1 (2025-07-19)


### Bug Fixes

* add overrides for test files in ESLint configuration ([d01ffa5](https://github.com/lolvOid/svgfusion/commit/d01ffa50aa1de4da1d4def4fe45417fa1d110d13))
* change export syntax from ES6 to CommonJS in release.config.js ([54b216a](https://github.com/lolvOid/svgfusion/commit/54b216a8fc8725151d9c0745b16ee0f8119531f1))
* ci ([54f3d29](https://github.com/lolvOid/svgfusion/commit/54f3d29b789fca9d2c77cab38098ca0a90c4ec49))
* correct YAML syntax in bundle_size workflow trigger ([17e8802](https://github.com/lolvOid/svgfusion/commit/17e88020dcc9a3f17a71ff47a3b83d17fbf91421))
* downgrade semantic-release to version 24.2.5 and update .gitignore to include dist directory ([e62d9c0](https://github.com/lolvOid/svgfusion/commit/e62d9c045bc847656032e0b55b5ae049839d605b))
* downgrade semantic-release to version 24.2.5 in package.json and pnpm-lock.yaml ([c1bedf8](https://github.com/lolvOid/svgfusion/commit/c1bedf802154a9e0833fc088d9f79e4f4215db6e))
* enhance SVG input handling to support both files and directories" ([a0e7000](https://github.com/lolvOid/svgfusion/commit/a0e7000c2b4d6f1f18c215173dd1eb1a4051eb23))
* improve postinstall script to check for docs directory before installation ([2d08dfb](https://github.com/lolvOid/svgfusion/commit/2d08dfb8b9f17cf2266ae599ffb176d4e4bf0d5f))
* include .cjs files in bundle size report calculation ([52fd1d1](https://github.com/lolvOid/svgfusion/commit/52fd1d197fff5eb1130c966ce4e663ac879cf917))
* migrate tests from Vitest to Jest and update tsconfig types ([27929a2](https://github.com/lolvOid/svgfusion/commit/27929a2600205851fcb4fd3984ee50166fe8297a))
* preserve SVG tag case in parser and add @types/jsdom ([8a51078](https://github.com/lolvOid/svgfusion/commit/8a510787fb1d461b2cef36081d4d43c50932b850))
* refine conditions for release_beta and deploy_preview jobs to ensure proper event handling ([da01d99](https://github.com/lolvOid/svgfusion/commit/da01d99d9e942df9af42ed8a0c90366cadf3d8e0))
* remove --frozen-lockfile option from pnpm install commands ([cdbbb16](https://github.com/lolvOid/svgfusion/commit/cdbbb1663755b77e275ae10fbf5f1972d4fa1f0b))
* remove Buy Me a Coffee widget script from Docusaurus config ([2618b14](https://github.com/lolvOid/svgfusion/commit/2618b14ec79b733dc1c914d5b3f48f0c910c7d85))
* remove extends option for semantic-release-monorepo in release config ([7f0dad1](https://github.com/lolvOid/svgfusion/commit/7f0dad1061465ef92d8384217176076e7747ed1a))
* remove unnecessary defineOptions call in Vue component snapshots ([b13e95c](https://github.com/lolvOid/svgfusion/commit/b13e95c70dd4ec37d53e0752dd085390eefbbd1f))
* remove unnecessary skip-step parameter from Jest coverage report action ([094f7fe](https://github.com/lolvOid/svgfusion/commit/094f7fea44c4dcd223378003da9f61209de7b378))
* reorganize CI workflow to build and upload documentation artifacts after release ([315347b](https://github.com/lolvOid/svgfusion/commit/315347b34d3443cc9605cd6ad12dd0d37e9e80d0))
* Set default isFixedStrokeWidth and update vectorEffect ([5e27e82](https://github.com/lolvOid/svgfusion/commit/5e27e827da8bfe4f10fbdb24346fe62016ff4f32))
* simplify semantic release branches configuration and clean up plugin options ([6ae59c7](https://github.com/lolvOid/svgfusion/commit/6ae59c7cd262996acfe24bfaec36121a0610aade))
* update build commands in netlify.toml to use pnpm for consistency ([1d9e87e](https://github.com/lolvOid/svgfusion/commit/1d9e87e04309534bcf6e4b8fd82bf38c5227b32e))
* update CI conditions for release jobs and enhance release configuration for better branch handling ([be7d405](https://github.com/lolvOid/svgfusion/commit/be7d405aa00a3705776f5b4ef4e1c10091cd0abf))
* update CI conditions for release jobs and refine test coverage script ([dd85a9f](https://github.com/lolvOid/svgfusion/commit/dd85a9f2ee64a1e1a248a6e35f5e4cee0bb5284c))
* update CI conditions for release_beta and deploy_preview jobs for proper event handling ([e644826](https://github.com/lolvOid/svgfusion/commit/e64482688bdf7a26145364094d2e80a960364354))
* update CI configuration to include additional branch patterns and adjust GITHUB_REF handling for better compatibility ([f598a46](https://github.com/lolvOid/svgfusion/commit/f598a466e61f2e7db8918ad9fa5a1f71e64533c7))
* update CI configuration to include additional GitHub context variables and adjust release branch patterns for consistency ([815ade2](https://github.com/lolvOid/svgfusion/commit/815ade2d932d1da1c356d69dcbb48fa90b5d9ec4))
* update CI workflow to allow all branches and remove unnecessary build steps ([c30672b](https://github.com/lolvOid/svgfusion/commit/c30672b2d2a71b16a4a9c23c276419eed6f32a84))
* update CI workflow to use --no-frozen-lockfile for dependency installation ([f1c8a9c](https://github.com/lolvOid/svgfusion/commit/f1c8a9c3222425b5676ecb10e4ee430b2b79a1b1))
* update CI/CD workflow permissions and refine branch triggers ([#3](https://github.com/lolvOid/svgfusion/issues/3)) ([95a59f3](https://github.com/lolvOid/svgfusion/commit/95a59f34ca7a91a08c26dc95bb281291039c9bbe))
* update CLI image reference in README and CLI usage documentation ([83225ce](https://github.com/lolvOid/svgfusion/commit/83225ce877d4fb73475b9868469b1502cbe96789))
* Update component name formatting to follow Microsoft .NET guidelines for acronyms and casing ([9de11d1](https://github.com/lolvOid/svgfusion/commit/9de11d17c1b28a7257d822c100dd91a8dacd2b6e))
* update conditions for release and deployment jobs to use github.head_ref for branch checks ([9ece8bb](https://github.com/lolvOid/svgfusion/commit/9ece8bb0565e33b080ef5cced9265a2acdb30c10))
* update conditions for release and release_beta jobs to use github.ref for branch checks ([e90b9a6](https://github.com/lolvOid/svgfusion/commit/e90b9a63996a5ac5f52df99160ce0bd9d4513313))
* Update documentation links and remove obsolete browser API documentation ([8b7136d](https://github.com/lolvOid/svgfusion/commit/8b7136d05e141ff0f281a484827fe354a89da260))
* update example directory paths in CLI integration tests ([5de5f04](https://github.com/lolvOid/svgfusion/commit/5de5f045953cafcd53e1c0da551d343fa583d296))
* update netlify configuration for svgfusion-docs build paths and commands ([07a3cfc](https://github.com/lolvOid/svgfusion/commit/07a3cfc9d1f32806a67a49372d356738b000c598))
* update NODE_AUTH_TOKEN secrets for release jobs and change registry URL to npmjs ([f3879ce](https://github.com/lolvOid/svgfusion/commit/f3879ced57a3fe7f7aa1f466c4669affba31176d))
* update NODE_AUTH_TOKEN to use NPM_TOKEN for beta release ([3045626](https://github.com/lolvOid/svgfusion/commit/304562673375a408f49650686752f349dcba94d9))
* update NODE_AUTH_TOKEN to use NPM_TOKEN_ for beta release ([456a24c](https://github.com/lolvOid/svgfusion/commit/456a24cfd7b1a38a75117ab2a3d411a95ba82508))
* update noExternal entries and add terserOptions for better bundling configuration ([e32d359](https://github.com/lolvOid/svgfusion/commit/e32d359f207c93e386af0fff4fec13f018180b50))
* update npm version badge in README to use shield style ([665349c](https://github.com/lolvOid/svgfusion/commit/665349c2bbd2e07203420ef958baf4ea77681d01))
* update npm version badge in README to use standard style ([1e4e4b7](https://github.com/lolvOid/svgfusion/commit/1e4e4b7b6e7ddd4f2f2b5d9c0f3a24d5de8f4124))
* update package analysis comments and remove redundant notes from bundle size report ([1a49921](https://github.com/lolvOid/svgfusion/commit/1a4992199d1b9c721c8c6b8f2a433fe2515678c5))
* update package.json import statements in release configuration files for consistency ([e55d4c2](https://github.com/lolvOid/svgfusion/commit/e55d4c26c045ba4aa420709c47852c44d0ddcac4))
* update prerelease scripts to include --pre-release flag for consistency ([ed7f812](https://github.com/lolvOid/svgfusion/commit/ed7f812ef4e4b67231c345c5eb9164cf1d30a747))
* update publishConfig to include registry URL and remove repository and bugs fields ([148eca3](https://github.com/lolvOid/svgfusion/commit/148eca38daecf47dbb85288524c5e519f609fed2))
* Update README and package description for clarity; remove obsolete browser API documentation ([189ffc7](https://github.com/lolvOid/svgfusion/commit/189ffc77eeb4d9ab6c7ad34e435e85e75366e110))
* update release and prerelease scripts to use pnpm run for consistency ([0fa7a7d](https://github.com/lolvOid/svgfusion/commit/0fa7a7dd9f2f4983fcfeafe695aac8d1ecb77ad5))
* update release configuration to support multiple prerelease branches and adjust CI settings ([23326fa](https://github.com/lolvOid/svgfusion/commit/23326fa54efb9b88fea7adabc58c10aca00ce722))
* update release job conditions to trigger only on main branch and refine beta release step ([7e4c195](https://github.com/lolvOid/svgfusion/commit/7e4c195b00546a088288a9bf02a62fb0731c0eba))
* update versioning in package.json files for svgfusion and svgfusion-cli ([9349d05](https://github.com/lolvOid/svgfusion/commit/9349d05f4410f7b27064a5275d61a5945cadba39))


### Features

* Add "none" to SVG paths in icon components ([367d87a](https://github.com/lolvOid/svgfusion/commit/367d87a80370d2f107d6e2b625d97b54cf0071fb))
* add accessibility and normalization options to CLI and generator ([24aad3f](https://github.com/lolvOid/svgfusion/commit/24aad3ff2845b4ae9d41f52034b434070f713b07))
* add advanced features with split colors, fixed stroke width, and duplicate validation ([2824b2a](https://github.com/lolvOid/svgfusion/commit/2824b2aa68d856d764ad320131aaa781b4f0abb4))
* add batch conversion for SVG files to React and Vue components ([b1ca079](https://github.com/lolvOid/svgfusion/commit/b1ca07925f331ce17184f196e23e24fab6b3f8d5))
* add browser-specific entry point and component generators for React and Vue ([73e6109](https://github.com/lolvOid/svgfusion/commit/73e6109d5d41100778356873ff246d4599e2c93f))
* add build step to CI workflow for package compilation ([bbde453](https://github.com/lolvOid/svgfusion/commit/bbde453867577bad2e1fd9fd0fe64184d2f344e1))
* add CLI banner and color utilities; update README with CLI image ([3589580](https://github.com/lolvOid/svgfusion/commit/35895805ac127deea496b56ef23737ab52b310c3))
* add distribution zip creation for svgfusion packages and update release config for downloadable assets ([daa3386](https://github.com/lolvOid/svgfusion/commit/daa3386d75c9a1a04e5b30e97440117b69f79ddf))
* add distribution zip creation for svgfusion packages and update release configuration ([03069ab](https://github.com/lolvOid/svgfusion/commit/03069ab8bba00e4e63cd55ff26aa963a9eb2e266))
* add dynamic prettier loading for code formatting in React and Vue generators ([e091efb](https://github.com/lolvOid/svgfusion/commit/e091efbfda4044867017f0754b31068c50e74112))
* add fill/stroke normalization feature to SVG transformer ([b2967fa](https://github.com/lolvOid/svgfusion/commit/b2967fa935111bd9189ed87e06e2c12fcfd1f4b0))
* Add fixed stroke width toggle ([6356380](https://github.com/lolvOid/svgfusion/commit/6356380054c00cef82c926971da50a374b48062a))
* Add HeartLine icon and improve color handling ([c9c3c80](https://github.com/lolvOid/svgfusion/commit/c9c3c80dad4f2c5d2b4d99ca43b247a8a27587a9))
* add just-pascal-case library for improved component name formatting ([9cb3fbd](https://github.com/lolvOid/svgfusion/commit/9cb3fbd7e30fe814e047d759dfa19d77103cfca7))
* add prefix and suffix options for component name formatting in CLI ([9cc67d0](https://github.com/lolvOid/svgfusion/commit/9cc67d07d8d9ccc144fc671ff58696859a8a1094))
* Add stroke width splitting to icon generators and demos ([729b6ae](https://github.com/lolvOid/svgfusion/commit/729b6ae84c70efb537171d41397d39225bb0a626))
* add watch script and enhance color gradients in CLI output ([a0e604c](https://github.com/lolvOid/svgfusion/commit/a0e604ceb5e2b94c4533f3acf839d67b2a71490c))
* Add width, height, and strokeWidth controls to icon demos ([29c0ae9](https://github.com/lolvOid/svgfusion/commit/29c0ae9f5a3f4d071f2b2a2d0328d6a894dadcfe))
* auto-deploy docs on main branch pushes ([97aaec0](https://github.com/lolvOid/svgfusion/commit/97aaec092f6aa47294748b81dbf0e58e9962a551))
* complete architecture refactor and enhance component generation ([409d979](https://github.com/lolvOid/svgfusion/commit/409d979be8f5b3f5de69fa7ed93ac4e52f408466))
* enhance bundle size report formatting and summary details ([08cee72](https://github.com/lolvOid/svgfusion/commit/08cee72bc62fee6bbdfd520952fcc7e087e9c118))
* enhance bundle size report with total sizes and detailed file breakdown ([ce4acfe](https://github.com/lolvOid/svgfusion/commit/ce4acfef62afdd420663ca5e949d0da0f7ad1a77))
* enhance React and Vue generators to support size prop and improve SVG attribute handling ([fb42c3d](https://github.com/lolvOid/svgfusion/commit/fb42c3d6a95abb77124c7015875ce71c2fa563ae))
* Enhance SEO with metadata, structured data, and robots.txt ([f006db0](https://github.com/lolvOid/svgfusion/commit/f006db040c1a748986303544858f3b0daef5aa51))
* enhance svgfusion-cli with TypeScript support and batch processing capabilities ([db3b5d9](https://github.com/lolvOid/svgfusion/commit/db3b5d9902967c58f7a152a04ccfc873b7d7b60b))
* export generateIndexFile and BatchConverter from respective modules ([5f6fbfa](https://github.com/lolvOid/svgfusion/commit/5f6fbfa47847be60089e015d5300640a98de7c31))
* Implement stroke width splitting feature for SVG components ([bfe3194](https://github.com/lolvOid/svgfusion/commit/bfe3194c9dd865029e8365918468053e951e33ea))
* initialize Vue demo project with Vite, Tailwind CSS, and TypeScript ([d301841](https://github.com/lolvOid/svgfusion/commit/d3018411eff881d25185533faea61b6e9bbef995))
* metdata ([1c27930](https://github.com/lolvOid/svgfusion/commit/1c279309ca005bb176aff600defa219c27abe3fb))
* monorepo initial ([8629b78](https://github.com/lolvOid/svgfusion/commit/8629b7879e4100da1c72e6b52bb8123584687062))
* **parser:** enhance SVG parsing with DOMParser and jsdom fallback ([bda8d60](https://github.com/lolvOid/svgfusion/commit/bda8d60269638607b9f94840677ed715d8b0aca0))
* update bundle size report workflow to include package-specific sizes and improve formatting ([0c87967](https://github.com/lolvOid/svgfusion/commit/0c879672bb1606436cb6f410934c784a42736c2e))
* update bundling configuration and add figlet dependency ([bd6a23d](https://github.com/lolvOid/svgfusion/commit/bd6a23d525bfe72efb21fdde349cfe97e66e4ade))
* update CI configuration and package settings for dual registry support and public access ([f873e21](https://github.com/lolvOid/svgfusion/commit/f873e21e58753a989fb101b96e886ea6b0bc4e1c))
* update CI workflow trigger branches and release condition ([cf4fdd7](https://github.com/lolvOid/svgfusion/commit/cf4fdd7d6084139cca06e5ae4227af3a08c15c63))
* update CLI and engine to improve performance and usability ([64131f4](https://github.com/lolvOid/svgfusion/commit/64131f4d0e0737278cf55825fbf92b4c58f842a4))
* update CLI structure and configuration for improved module handling and entry points ([ba610f2](https://github.com/lolvOid/svgfusion/commit/ba610f280123d74b552760c14c24b67d97a807c3))
* update component naming and default props handling ([f1f1ff6](https://github.com/lolvOid/svgfusion/commit/f1f1ff67201cd3139463c9ccb34ec37217311125))
* update docs ([ee83a59](https://github.com/lolvOid/svgfusion/commit/ee83a595f5a1f5bcbc9f2523fb682da6f68166d3))
* update package versions and enhance bundling configuration ([a430971](https://github.com/lolvOid/svgfusion/commit/a430971f755e87d97753ceea0d46de12bd402f65))
* Update README with improved feature list and intro ([736736b](https://github.com/lolvOid/svgfusion/commit/736736be0d15ed2a0050f94e8b603e1c487f56eb))
* version change ([a575f38](https://github.com/lolvOid/svgfusion/commit/a575f388daf67a947ca77cf337dd5ca8a2d40081))

# svgfusion-cli-v1.0.0-beta.1 (2025-07-18)


### Bug Fixes

* update package.json import statements in release configuration files for consistency ([e55d4c2](https://github.com/lolvOid/svgfusion/commit/e55d4c26c045ba4aa420709c47852c44d0ddcac4))
* update versioning in package.json files for svgfusion and svgfusion-cli ([9349d05](https://github.com/lolvOid/svgfusion/commit/9349d05f4410f7b27064a5275d61a5945cadba39))


### Features

* add browser-specific entry point and component generators for React and Vue ([73e6109](https://github.com/lolvOid/svgfusion/commit/73e6109d5d41100778356873ff246d4599e2c93f))
* enhance svgfusion-cli with TypeScript support and batch processing capabilities ([db3b5d9](https://github.com/lolvOid/svgfusion/commit/db3b5d9902967c58f7a152a04ccfc873b7d7b60b))
* monorepo initial ([8629b78](https://github.com/lolvOid/svgfusion/commit/8629b7879e4100da1c72e6b52bb8123584687062))
* update bundling configuration and add figlet dependency ([bd6a23d](https://github.com/lolvOid/svgfusion/commit/bd6a23d525bfe72efb21fdde349cfe97e66e4ade))
* update CI configuration and package settings for dual registry support and public access ([f873e21](https://github.com/lolvOid/svgfusion/commit/f873e21e58753a989fb101b96e886ea6b0bc4e1c))
* update CLI structure and configuration for improved module handling and entry points ([ba610f2](https://github.com/lolvOid/svgfusion/commit/ba610f280123d74b552760c14c24b67d97a807c3))
* update package versions and enhance bundling configuration ([a430971](https://github.com/lolvOid/svgfusion/commit/a430971f755e87d97753ceea0d46de12bd402f65))

# svgfusion-cli-v1.0.0-refactor.1 (2025-07-17)


### Bug Fixes

* update package.json import statements in release configuration files for consistency ([e55d4c2](https://github.com/lolvOid/svgfusion/commit/e55d4c26c045ba4aa420709c47852c44d0ddcac4))


### Features

* add browser-specific entry point and component generators for React and Vue ([73e6109](https://github.com/lolvOid/svgfusion/commit/73e6109d5d41100778356873ff246d4599e2c93f))
* enhance svgfusion-cli with TypeScript support and batch processing capabilities ([db3b5d9](https://github.com/lolvOid/svgfusion/commit/db3b5d9902967c58f7a152a04ccfc873b7d7b60b))
* monorepo initial ([8629b78](https://github.com/lolvOid/svgfusion/commit/8629b7879e4100da1c72e6b52bb8123584687062))
* update bundling configuration and add figlet dependency ([bd6a23d](https://github.com/lolvOid/svgfusion/commit/bd6a23d525bfe72efb21fdde349cfe97e66e4ade))
* update CI configuration and package settings for dual registry support and public access ([f873e21](https://github.com/lolvOid/svgfusion/commit/f873e21e58753a989fb101b96e886ea6b0bc4e1c))
* update CLI structure and configuration for improved module handling and entry points ([ba610f2](https://github.com/lolvOid/svgfusion/commit/ba610f280123d74b552760c14c24b67d97a807c3))
* update package versions and enhance bundling configuration ([a430971](https://github.com/lolvOid/svgfusion/commit/a430971f755e87d97753ceea0d46de12bd402f65))
