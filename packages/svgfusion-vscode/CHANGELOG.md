# [1.2.0](https://github.com/lolvOid/svgfusion/compare/svgfusion-vscode@1.1.0...svgfusion-vscode@1.2.0) (2025-07-19)


### Features

* update workspace dependency specifications to use caret (^) for versioning ([9aa74a9](https://github.com/lolvOid/svgfusion/commit/9aa74a916f1854709ec58e5507f87b7698e3bc0b))

# [1.1.0](https://github.com/lolvOid/svgfusion/compare/svgfusion-vscode@1.0.1...svgfusion-vscode@1.1.0) (2025-07-19)


### Features

* **svgfusion-vscode:** implement batch conversion options and update playground UI ([abbb4ce](https://github.com/lolvOid/svgfusion/commit/abbb4ce336a81732d44588b8a20700109a761258))

# 1.0.0 (2025-07-19)


### Bug Fixes

* add overrides for test files in ESLint configuration ([d01ffa5](https://github.com/lolvOid/svgfusion/commit/d01ffa50aa1de4da1d4def4fe45417fa1d110d13))
* change export syntax from ES6 to CommonJS in release.config.js ([54b216a](https://github.com/lolvOid/svgfusion/commit/54b216a8fc8725151d9c0745b16ee0f8119531f1))
* enhance SVG input handling to support both files and directories" ([a0e7000](https://github.com/lolvOid/svgfusion/commit/a0e7000c2b4d6f1f18c215173dd1eb1a4051eb23))
* improve postinstall script to check for docs directory before installation ([2d08dfb](https://github.com/lolvOid/svgfusion/commit/2d08dfb8b9f17cf2266ae599ffb176d4e4bf0d5f))
* migrate tests from Vitest to Jest and update tsconfig types ([27929a2](https://github.com/lolvOid/svgfusion/commit/27929a2600205851fcb4fd3984ee50166fe8297a))
* preserve SVG tag case in parser and add @types/jsdom ([8a51078](https://github.com/lolvOid/svgfusion/commit/8a510787fb1d461b2cef36081d4d43c50932b850))
* remove --frozen-lockfile option from pnpm install commands ([cdbbb16](https://github.com/lolvOid/svgfusion/commit/cdbbb1663755b77e275ae10fbf5f1972d4fa1f0b))
* remove unnecessary defineOptions call in Vue component snapshots ([b13e95c](https://github.com/lolvOid/svgfusion/commit/b13e95c70dd4ec37d53e0752dd085390eefbbd1f))
* reorganize CI workflow to build and upload documentation artifacts after release ([315347b](https://github.com/lolvOid/svgfusion/commit/315347b34d3443cc9605cd6ad12dd0d37e9e80d0))
* Set default isFixedStrokeWidth and update vectorEffect ([5e27e82](https://github.com/lolvOid/svgfusion/commit/5e27e827da8bfe4f10fbdb24346fe62016ff4f32))
* simplify semantic release branches configuration and clean up plugin options ([6ae59c7](https://github.com/lolvOid/svgfusion/commit/6ae59c7cd262996acfe24bfaec36121a0610aade))
* update build commands in netlify.toml to use pnpm for consistency ([1d9e87e](https://github.com/lolvOid/svgfusion/commit/1d9e87e04309534bcf6e4b8fd82bf38c5227b32e))
* update CI workflow to allow all branches and remove unnecessary build steps ([c30672b](https://github.com/lolvOid/svgfusion/commit/c30672b2d2a71b16a4a9c23c276419eed6f32a84))
* update CI workflow to use --no-frozen-lockfile for dependency installation ([f1c8a9c](https://github.com/lolvOid/svgfusion/commit/f1c8a9c3222425b5676ecb10e4ee430b2b79a1b1))
* update CI/CD workflow permissions and refine branch triggers ([#3](https://github.com/lolvOid/svgfusion/issues/3)) ([95a59f3](https://github.com/lolvOid/svgfusion/commit/95a59f34ca7a91a08c26dc95bb281291039c9bbe))
* update CLI image reference in README and CLI usage documentation ([83225ce](https://github.com/lolvOid/svgfusion/commit/83225ce877d4fb73475b9868469b1502cbe96789))
* Update component name formatting to follow Microsoft .NET guidelines for acronyms and casing ([9de11d1](https://github.com/lolvOid/svgfusion/commit/9de11d17c1b28a7257d822c100dd91a8dacd2b6e))
* Update documentation links and remove obsolete browser API documentation ([8b7136d](https://github.com/lolvOid/svgfusion/commit/8b7136d05e141ff0f281a484827fe354a89da260))
* update example directory paths in CLI integration tests ([5de5f04](https://github.com/lolvOid/svgfusion/commit/5de5f045953cafcd53e1c0da551d343fa583d296))
* update npm version badge in README to use shield style ([665349c](https://github.com/lolvOid/svgfusion/commit/665349c2bbd2e07203420ef958baf4ea77681d01))
* update npm version badge in README to use standard style ([1e4e4b7](https://github.com/lolvOid/svgfusion/commit/1e4e4b7b6e7ddd4f2f2b5d9c0f3a24d5de8f4124))
* update package versions for svgfusion-dom, svgfusion-bundle, and svgfusion-cmd ([3c299de](https://github.com/lolvOid/svgfusion/commit/3c299de4a5694ad80d8e16d23944590469fa62ab))
* update publishConfig to include registry URL and remove repository and bugs fields ([148eca3](https://github.com/lolvOid/svgfusion/commit/148eca38daecf47dbb85288524c5e519f609fed2))
* Update README and package description for clarity; remove obsolete browser API documentation ([189ffc7](https://github.com/lolvOid/svgfusion/commit/189ffc77eeb4d9ab6c7ad34e435e85e75366e110))
* update release:all script to only run release:bundle ([65a6195](https://github.com/lolvOid/svgfusion/commit/65a61952a7954916bd1972e358b82f75f3e25da1))


### Features

* Add "none" to SVG paths in icon components ([367d87a](https://github.com/lolvOid/svgfusion/commit/367d87a80370d2f107d6e2b625d97b54cf0071fb))
* add accessibility and normalization options to CLI and generator ([24aad3f](https://github.com/lolvOid/svgfusion/commit/24aad3ff2845b4ae9d41f52034b434070f713b07))
* add advanced features with split colors, fixed stroke width, and duplicate validation ([2824b2a](https://github.com/lolvOid/svgfusion/commit/2824b2aa68d856d764ad320131aaa781b4f0abb4))
* add batch conversion for SVG files to React and Vue components ([b1ca079](https://github.com/lolvOid/svgfusion/commit/b1ca07925f331ce17184f196e23e24fab6b3f8d5))
* add CLI banner and color utilities; update README with CLI image ([3589580](https://github.com/lolvOid/svgfusion/commit/35895805ac127deea496b56ef23737ab52b310c3))
* add fill/stroke normalization feature to SVG transformer ([b2967fa](https://github.com/lolvOid/svgfusion/commit/b2967fa935111bd9189ed87e06e2c12fcfd1f4b0))
* Add fixed stroke width toggle ([6356380](https://github.com/lolvOid/svgfusion/commit/6356380054c00cef82c926971da50a374b48062a))
* Add HeartLine icon and improve color handling ([c9c3c80](https://github.com/lolvOid/svgfusion/commit/c9c3c80dad4f2c5d2b4d99ca43b247a8a27587a9))
* add just-pascal-case library for improved component name formatting ([9cb3fbd](https://github.com/lolvOid/svgfusion/commit/9cb3fbd7e30fe814e047d759dfa19d77103cfca7))
* add prefix and suffix options for component name formatting in CLI ([9cc67d0](https://github.com/lolvOid/svgfusion/commit/9cc67d07d8d9ccc144fc671ff58696859a8a1094))
* Add stroke width splitting to icon generators and demos ([729b6ae](https://github.com/lolvOid/svgfusion/commit/729b6ae84c70efb537171d41397d39225bb0a626))
* add support for semantic-release-monorepo in release configuration ([168a808](https://github.com/lolvOid/svgfusion/commit/168a8086cb49b1fde7b4699ac355ddde63c0d793))
* add watch script and enhance color gradients in CLI output ([a0e604c](https://github.com/lolvOid/svgfusion/commit/a0e604ceb5e2b94c4533f3acf839d67b2a71490c))
* Add width, height, and strokeWidth controls to icon demos ([29c0ae9](https://github.com/lolvOid/svgfusion/commit/29c0ae9f5a3f4d071f2b2a2d0328d6a894dadcfe))
* auto-deploy docs on main branch pushes ([97aaec0](https://github.com/lolvOid/svgfusion/commit/97aaec092f6aa47294748b81dbf0e58e9962a551))
* complete architecture refactor and enhance component generation ([409d979](https://github.com/lolvOid/svgfusion/commit/409d979be8f5b3f5de69fa7ed93ac4e52f408466))
* enhance React and Vue generators to support size prop and improve SVG attribute handling ([fb42c3d](https://github.com/lolvOid/svgfusion/commit/fb42c3d6a95abb77124c7015875ce71c2fa563ae))
* Enhance SEO with metadata, structured data, and robots.txt ([f006db0](https://github.com/lolvOid/svgfusion/commit/f006db040c1a748986303544858f3b0daef5aa51))
* export generateIndexFile and BatchConverter from respective modules ([5f6fbfa](https://github.com/lolvOid/svgfusion/commit/5f6fbfa47847be60089e015d5300640a98de7c31))
* Implement stroke width splitting feature for SVG components ([bfe3194](https://github.com/lolvOid/svgfusion/commit/bfe3194c9dd865029e8365918468053e951e33ea))
* initialize Vue demo project with Vite, Tailwind CSS, and TypeScript ([d301841](https://github.com/lolvOid/svgfusion/commit/d3018411eff881d25185533faea61b6e9bbef995))
* metdata ([1c27930](https://github.com/lolvOid/svgfusion/commit/1c279309ca005bb176aff600defa219c27abe3fb))
* **parser:** enhance SVG parsing with DOMParser and jsdom fallback ([bda8d60](https://github.com/lolvOid/svgfusion/commit/bda8d60269638607b9f94840677ed715d8b0aca0))
* svgfusion-extension ([8b301ff](https://github.com/lolvOid/svgfusion/commit/8b301ffcc68ac3d7609feff385dca8dd7500b8fc))
* **svgfusion-vscode:** enhance SVG conversion with prefix and suffix options, add release configuration ([5494feb](https://github.com/lolvOid/svgfusion/commit/5494feb641c76c2687718bff02d3c62c93d05739))
* update CLI and engine to improve performance and usability ([64131f4](https://github.com/lolvOid/svgfusion/commit/64131f4d0e0737278cf55825fbf92b4c58f842a4))
* update component naming and default props handling ([f1f1ff6](https://github.com/lolvOid/svgfusion/commit/f1f1ff67201cd3139463c9ccb34ec37217311125))
* update docs ([ee83a59](https://github.com/lolvOid/svgfusion/commit/ee83a595f5a1f5bcbc9f2523fb682da6f68166d3))
* Update README with improved feature list and intro ([736736b](https://github.com/lolvOid/svgfusion/commit/736736be0d15ed2a0050f94e8b603e1c487f56eb))
* version change ([a575f38](https://github.com/lolvOid/svgfusion/commit/a575f388daf67a947ca77cf337dd5ca8a2d40081))

# Changelog

All notable changes to the SVGFusion VSCode extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release of SVGFusion VSCode extension
- SVG to React/Vue component conversion
- Batch processing capabilities
- Interactive playground for testing conversions
- SVG preview with different sizes and backgrounds
- Automatic framework detection
- Smart configuration management
- Hover provider with SVG information
- Tree view for exploring SVG files
- Status bar integration
- Command palette integration
- Right-click context menu actions
- Keyboard shortcuts for quick conversion
- TypeScript support
- Framework-specific options (React memo/forwardRef, Vue SFC/script setup)
- Color and stroke width extraction
- SVG optimization before conversion

### Features

#### Core Functionality

- **Convert Single SVG**: Right-click conversion with full option selection
- **Batch Convert**: Select and convert multiple SVGs with progress tracking
- **Interactive Playground**: Test conversions with real-time preview
- **SVG Preview**: View SVGs with different backgrounds and sizes

#### Smart Features

- **Framework Detection**: Automatically detects React/Vue projects
- **Component Naming**: Smart conversion from file names to component names
- **Output Management**: Configurable output directories
- **Error Handling**: Comprehensive error reporting and recovery

#### Developer Experience

- **Hover Information**: View SVG details on hover
- **Tree View**: Explore SVG files in workspace
- **Status Bar**: Quick access to conversion status
- **Keyboard Shortcuts**: Fast workflow integration

#### Customization

- **Framework Selection**: Choose React, Vue, or auto-detection
- **Language Support**: TypeScript and JavaScript output
- **Component Options**: Memo, forwardRef, SFC, script setup
- **Transformation**: Color extraction, stroke width handling, optimization
