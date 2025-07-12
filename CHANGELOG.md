# [1.10.0](https://github.com/lolvOid/svgfusion/compare/v1.9.0...v1.10.0) (2025-07-12)


### Bug Fixes

* update example directory paths in CLI integration tests ([9089644](https://github.com/lolvOid/svgfusion/commit/9089644f1ee199a86e9363454c0193443be1f1c3))


### Features

* initialize Vue demo project with Vite, Tailwind CSS, and TypeScript ([99e276a](https://github.com/lolvOid/svgfusion/commit/99e276a6cf96e7bee02cf2e283ac4ed6bf9defd6))

# [1.9.0](https://github.com/lolvOid/svgfusion/compare/v1.8.0...v1.9.0) (2025-07-11)


### Features

* enhance React and Vue generators to support size prop and improve SVG attribute handling ([765dd1e](https://github.com/lolvOid/svgfusion/commit/765dd1eddd6cdd680551fd25978e4f8fda1a6151))

# [1.8.0](https://github.com/lolvOid/svgfusion/compare/v1.7.0...v1.8.0) (2025-07-11)


### Features

* complete architecture refactor and enhance component generation ([e8b023e](https://github.com/lolvOid/svgfusion/commit/e8b023e591c3abac80ad6ce785742345c49411d9))
* update CLI and engine to improve performance and usability ([374bfa4](https://github.com/lolvOid/svgfusion/commit/374bfa4a31bf563d239f339dd4600d78b3f1a213))

# [2.0.0](https://github.com/lolvOid/svgfusion/compare/v1.7.0...v2.0.0) (2025-07-12)

## 🚀 Major Architecture Rewrite

### BREAKING CHANGES

* **Complete internal architecture replacement**: Replaced SVGR/SVGO dependencies with custom SVGFusion engine for better control and reliability
* **API Changes**: Updated programmatic API to use new `SVGFusion` class instead of `convertToReact`/`convertToVue` functions
* **Enhanced Type Safety**: Stricter TypeScript integration with improved type inference

### Features

* **🏗️ Custom SVGFusion Engine**: Complete rewrite with custom SVG parser and transformation system
* **🎨 Native SVG Props Support**: Generated React components extend `React.SVGProps<SVGSVGElement>` for full native prop inheritance
* **🎯 Vue Attributes Support**: Generated Vue components extend `SVGAttributes` with `v-bind="$attrs"` for complete attribute coverage
* **⚡ Enhanced Performance**: Faster processing with streamlined synchronous architecture
* **🔧 Feature-Based Transformations**: Modular transformation system with color-splitting, stroke-fixing, and accessibility features
* **📝 Improved Type Safety**: Better TypeScript integration with proper type definitions and inference
* **🛡️ Robust Error Handling**: Enhanced error handling and validation throughout the conversion process

### Bug Fixes

* **TypeScript/ESLint Issues**: Resolved all linting issues and improved code quality
* **Async/Sync Consistency**: Converted to synchronous API for simpler usage patterns
* **CLI Improvements**: Enhanced CLI with better error handling and user feedback

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
const reactResult = engine.convert(svgContent, { framework: 'react', ...options });
const vueResult = engine.convert(svgContent, { framework: 'vue', ...options });
```

### Component Output Changes

* **React Components**: Now extend `React.SVGProps<SVGSVGElement>` providing all native SVG element props
* **Vue Components**: Now extend `SVGAttributes` with proper attribute inheritance via `v-bind="$attrs"`
* **Enhanced TypeScript**: Better type inference and native prop support

# [1.7.0](https://github.com/lolvOid/svgfusion/compare/v1.6.0...v1.7.0) (2025-07-11)


### Features

* add advanced features with split colors, fixed stroke width, and duplicate validation ([94c429f](https://github.com/lolvOid/svgfusion/commit/94c429fbf4325b9e42eab9af30b9e18c35b2e986))

# [1.6.0](https://github.com/lolvOid/svgfusion/compare/v1.5.1...v1.6.0) (2025-07-11)


### Features

* export generateIndexFile and BatchConverter from respective modules ([07cbf15](https://github.com/lolvOid/svgfusion/commit/07cbf154c18e9a1ce4d09adeecd43be54ab24e35))

## [1.5.1](https://github.com/lolvOid/svgfusion/compare/v1.5.0...v1.5.1) (2025-07-11)


### Bug Fixes

* update CLI image reference in README and CLI usage documentation ([bccb0bd](https://github.com/lolvOid/svgfusion/commit/bccb0bd4b8108b4387df43270e19fdc588f9833b))

# [1.5.0](https://github.com/lolvOid/svgfusion/compare/v1.4.0...v1.5.0) (2025-07-11)


### Features

* add batch conversion for SVG files to React and Vue components ([8f46391](https://github.com/lolvOid/svgfusion/commit/8f463914d897eba80fe67d6093ab58e6cadf33e0))

# [1.4.0](https://github.com/lolvOid/svgfusion/compare/v1.3.0...v1.4.0) (2025-07-11)


### Features

* add CLI banner and color utilities; update README with CLI image ([13a29a6](https://github.com/lolvOid/svgfusion/commit/13a29a622cbdfa5a7af62f3b027513c2d7840c3b))

# [1.3.0](https://github.com/lolvOid/svgfusion/compare/v1.2.1...v1.3.0) (2025-07-11)


### Features

* add prefix and suffix options for component name formatting in CLI ([5f5a604](https://github.com/lolvOid/svgfusion/commit/5f5a604bb58586673fe7be83abbfb196025e3cd8))

## [1.2.1](https://github.com/lolvOid/svgfusion/compare/v1.2.0...v1.2.1) (2025-07-11)


### Bug Fixes

* update npm version badge in README to use standard style ([68d6df2](https://github.com/lolvOid/svgfusion/commit/68d6df21c296cc3a9445322fde037467466a344c))

# [1.2.0](https://github.com/lolvOid/svgfusion/compare/v1.1.1...v1.2.0) (2025-07-11)


### Features

* add just-pascal-case library for improved component name formatting ([8e7a5ef](https://github.com/lolvOid/svgfusion/commit/8e7a5efbf48b9e36d48d37a441151af77c292a96))

## [1.1.1](https://github.com/lolvOid/svgfusion/compare/v1.1.0...v1.1.1) (2025-07-11)


### Bug Fixes

* update npm version badge in README to use shield style ([9b50a21](https://github.com/lolvOid/svgfusion/commit/9b50a21e49a24180156a6c30fa0e09f5995f01fa))

# [1.1.0](https://github.com/lolvOid/svgfusion/compare/v1.0.7...v1.1.0) (2025-07-11)


### Features

* add watch script and enhance color gradients in CLI output ([de5bfeb](https://github.com/lolvOid/svgfusion/commit/de5bfebf0b536686646a4d1c30edb345f99dd91a))

## [1.0.7](https://github.com/lolvOid/svgfusion/compare/v1.0.6...v1.0.7) (2025-07-11)


### Bug Fixes

* enhance SVG input handling to support both files and directories" ([20a75d9](https://github.com/lolvOid/svgfusion/commit/20a75d95b5b683f9200689e5d55da7220cd07eea))

## [1.0.6](https://github.com/lolvOid/svgfusion/compare/v1.0.5...v1.0.6) (2025-07-11)


### Bug Fixes

* update CI/CD workflow permissions and refine branch triggers ([#3](https://github.com/lolvOid/svgfusion/issues/3)) ([ef7f248](https://github.com/lolvOid/svgfusion/commit/ef7f2488b224233fbd12228f0e781f611de693d9))

## [1.0.5](https://github.com/lolvOid/svgfusion/compare/v1.0.4...v1.0.5) (2025-07-11)


### Bug Fixes

* simplify semantic release branches configuration and clean up plugin options ([87759f2](https://github.com/lolvOid/svgfusion/commit/87759f26d00f6f9205e876eeb97ccbbc9fea5413))

## [1.0.4](https://github.com/lolvOid/svgfusion/compare/v1.0.3...v1.0.4) (2025-07-11)


### Bug Fixes

* update CI workflow to allow all branches and remove unnecessary build steps ([eca96a8](https://github.com/lolvOid/svgfusion/commit/eca96a81d49fe7c1aec9458f7b3435334e4dc265))

## [1.0.3](https://github.com/lolvOid/svgfusion/compare/v1.0.2...v1.0.3) (2025-07-10)


### Bug Fixes

* reorganize CI workflow to build and upload documentation artifacts after release ([8c38616](https://github.com/lolvOid/svgfusion/commit/8c3861630be2d196f6ebee6a5a7cf4dd32046757))

## [1.0.2](https://github.com/lolvOid/svgfusion/compare/v1.0.1...v1.0.2) (2025-07-10)


### Bug Fixes

* add overrides for test files in ESLint configuration ([627a942](https://github.com/lolvOid/svgfusion/commit/627a9427b3d989edcfe2de334456811c991ca99b))
* improve postinstall script to check for docs directory before installation ([db9e933](https://github.com/lolvOid/svgfusion/commit/db9e933a93053e6987614e96ed83cc64ab5dccd1))
* migrate tests from Vitest to Jest and update tsconfig types ([b5a8025](https://github.com/lolvOid/svgfusion/commit/b5a8025197bcc59259b9749e46c34c50ae3acc70))
* update build commands in netlify.toml to use pnpm for consistency ([2f6756b](https://github.com/lolvOid/svgfusion/commit/2f6756bdbfb1a6c77b3e3ca0239627b51d1149ce))
* update CI workflow to use --no-frozen-lockfile for dependency installation ([f0717a3](https://github.com/lolvOid/svgfusion/commit/f0717a38974df446802eb9574c4cdc227df08c71))

## [1.0.1](https://github.com/lolvOid/svgfusion/compare/v1.0.0...v1.0.1) (2025-07-09)


### Bug Fixes

* change export syntax from ES6 to CommonJS in release.config.js ([455805d](https://github.com/lolvOid/svgfusion/commit/455805df8f0422e907a3137f0e0e88932d116342))

# 1.0.0 (2025-07-09)


### Features

* auto-deploy docs on main branch pushes ([38ed861](https://github.com/lolvOid/svgfusion/commit/38ed861eb1734200ae447f2530dbc821d397c840))

# [1.0.0-beta.9](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2025-07-09)


### Features

* update permissions in GitHub workflows and enhance README layout ([076de4c](https://github.com/lolvOid/svgfusion/commit/076de4cf3067e217dea48b29e8052a6ec14a88ce))

# [1.0.0-beta.8](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2025-07-09)


### Features

* Initialize Docusaurus documentation site with essential components and styles ([4356ff1](https://github.com/lolvOid/svgfusion/commit/4356ff16d6579fffe405af58e9af28a3a5e169dc))

# [1.0.0-beta.7](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2025-07-09)


### Features

* enhance CLI with colored ASCII art banner and improved output messages ([4e01450](https://github.com/lolvOid/svgfusion/commit/4e014504e19d97b4478aa08f2e6ebe634ef06511))

# [1.0.0-beta.6](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2025-07-09)


### Features

* add figlet dependency and create ASCII art banner for CLI ([8c409c5](https://github.com/lolvOid/svgfusion/commit/8c409c5719201bcf9727ac6d61c0ab07eaf5a5aa))

# [1.0.0-beta.5](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2025-07-09)


### Features

* update README and package.json ([13027ba](https://github.com/lolvOid/svgfusion/commit/13027ba40f379225648cd0bedbfcd801b10de26f))

# [1.0.0-beta.4](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2025-07-09)


### Features

* add GitHub Action for bundle size reporting on pull requests ([3049b7e](https://github.com/lolvOid/svgfusion/commit/3049b7e79066454ddddb1595347ea8155dc40e53))

# [1.0.0-beta.3](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2025-07-09)


### Features

* add CLI for SVG to React/Vue conversion and configure testing ([1e58863](https://github.com/lolvOid/svgfusion/commit/1e5886398c887f2d989c817d4cf04363bc6d331d))

# [1.0.0-beta.2](https://github.com/lolvOid/svgfusion/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2025-07-09)


### Features

* publish ([13708ee](https://github.com/lolvOid/svgfusion/commit/13708eedd50f7ff14a50efe03696ceb8de11afae))

# 1.0.0-beta.1 (2025-07-09)


### Bug Fixes

* correct build output paths in package.json for npm publishing ([c61c1b1](https://github.com/lolvOid/svgfusion/commit/c61c1b136856b7fbd4ea13b5d3468ddb370169ca))


### Features

* fix husky ([af4fc1e](https://github.com/lolvOid/svgfusion/commit/af4fc1eaacb5a28f117ece6822a15561cadee57a))
* initialize svgfusion project with SVG to React and Vue component conversion ([a02c5f5](https://github.com/lolvOid/svgfusion/commit/a02c5f5d3f643ba75f02d021744e7e153c1935d3))
