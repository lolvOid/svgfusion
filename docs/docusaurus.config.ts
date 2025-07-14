import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { readFileSync } from 'fs';
import { join } from 'path';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Read version from parent package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
) as { version: string };

const config: Config = {
  title: 'SVGFusion - Transform SVG to React & Vue Components',
  tagline:
    'Transform SVG files into production-ready React and Vue 3 components',
  favicon: 'img/favicon.ico',
  
  // SEO metadata
  metadata: [
    // Add Google site verification if available from environment
    ...(process.env.GOOGLE_SITE_VERIFICATION ? [{
      name: 'google-site-verification',
      content: process.env.GOOGLE_SITE_VERIFICATION
    }] : []),
    {
      name: 'description',
      content: 'SVGFusion transforms SVG files into production-ready React and Vue 3 components with TypeScript support, accessibility features, and customizable styling options.'
    },
    {
      name: 'keywords',
      content: 'SVG, React, Vue, components, TypeScript, icons, conversion, accessibility, web development, frontend'
    },
    {
      name: 'author',
      content: 'SVGFusion Team'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:title',
      content: 'SVGFusion - Transform SVG to React & Vue Components'
    },
    {
      property: 'og:description',
      content: 'Transform SVG files into production-ready React and Vue 3 components with TypeScript support, accessibility features, and customizable styling options.'
    },
    {
      property: 'og:site_name',
      content: 'SVGFusion'
    },
    {
      property: 'og:url',
      content: 'https://svgfusion.netlify.app'
    },
    {
      property: 'og:image',
      content: 'https://i.ibb.co/TZFfpFL/logo.png'
    },
    {
      property: 'og:image:width',
      content: '120'
    },
    {
      property: 'og:image:height',
      content: '120'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'SVGFusion - Transform SVG to React & Vue Components'
    },
    {
      name: 'twitter:description',
      content: 'Transform SVG files into production-ready React and Vue 3 components with TypeScript support, accessibility features, and customizable styling options.'
    },
    {
      name: 'twitter:image',
      content: 'https://i.ibb.co/TZFfpFL/logo.png'
    }
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

  scripts: [
    {
      src: 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js',
      'data-name': 'BMC-Widget',
      'data-cfasync': 'false',
      'data-id': 'freddielin',
      'data-description': 'Support SVGFusion development!',
      'data-message': 'Help keep SVGFusion free and growing!',
      'data-color': '#40DCA5',
      'data-position': 'Right',
      'data-x_margin': '18',
      'data-y_margin': '18',
    },
  ],

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
