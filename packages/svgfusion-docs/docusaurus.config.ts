import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// ESM-compatible __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from bundle package.json
const packageJson = JSON.parse(
  readFileSync(
    join(__dirname, '..', 'svgfusion-bundle', 'package.json'),
    'utf-8'
  )
) as { version: string };

const config: Config = {
  title: 'SVGFusion',
  tagline: 'Transform SVG files into React and Vue components',
  favicon: 'img/favicon.ico',

  // Head tags for SEO
  headTags: [
    // Google site verification if available from environment
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? [
          {
            tagName: 'meta',
            attributes: {
              name: 'google-site-verification',
              content: process.env.GOOGLE_SITE_VERIFICATION,
            },
          },
        ]
      : []),
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Configure webpack to disable Node.js polyfills
  plugins: [
    function webpackPlugin() {
      return {
        name: 'webpack-plugin',
        configureWebpack(config: any) {
          const webpack = require('webpack');
          return {
            resolve: {
              fallback: {
                fs: false,
                path: false,
                os: false,
                util: false,
                url: false,
                module: false,
                'fs/promises': false,
              },
            },
            plugins: [
              // Define global variables to handle Node.js globals in browser
              new webpack.DefinePlugin({
                __dirname: JSON.stringify('/'),
                __filename: JSON.stringify('/index.js'),
                global: 'globalThis',
              }),
            ],
          };
        },
      };
    },
  ],

  // Set the production url of your site here
  url: 'https://svgfusion.netlify.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'lolvOid', // Usually your GitHub org/user name.
  projectName: 'svgfusion', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  scripts: [],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: 'https://github.com/lolvOid/svgfusion/tree/main/docs/',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Social card for sharing
    image: 'https://i.ibb.co/TZFfpFL/logo.png',
    // SEO metadata
    metadata: [
      {
        name: 'keywords',
        content:
          'SVG, React, Vue, components, TypeScript, icons, conversion, accessibility, web development, frontend',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        property: 'og:image',
        content: 'https://i.ibb.co/TZFfpFL/logo.png',
      },
      {
        property: 'og:image:width',
        content: '120',
      },
      {
        property: 'og:image:height',
        content: '120',
      },
    ],
    navbar: {
      title: 'SVGFusion',
      logo: {
        alt: 'SVGFusion Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/playground',
          label: 'Playground',
          position: 'left',
        },
        {
          type: 'html',
          position: 'right',
          value: `<a href="https://www.npmjs.com/package/svgfusion" target="_blank" rel="noopener noreferrer" style="color: var(--ifm-navbar-link-color); text-decoration: none; padding: 0.25rem 0.5rem; border-radius: 0.25rem; background: var(--ifm-color-emphasis-100); font-size: 0.875rem; font-weight: 500;">v${packageJson.version}</a>`,
        },
        {
          href: 'https://github.com/lolvOid/svgfusion',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'CLI Usage',
              to: '/docs/cli-usage',
            },
            {
              label: 'Node API',
              to: '/docs/node-api',
            },
            {
              label: 'Browser API',
              to: '/docs/browser-api',
            },
          ],
        },
        {
          title: 'Tools',
          items: [
            {
              label: 'NPM Package',
              href: 'https://www.npmjs.com/package/svgfusion',
            },
            {
              label: 'GitHub Repository',
              href: 'https://github.com/lolvOid/svgfusion',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/lolvOid/svgfusion',
            },
            {
              label: 'Issues',
              href: 'https://github.com/lolvOid/svgfusion/issues',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SVGFusion`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
