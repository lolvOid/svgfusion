# SVGFusion Documentation

This directory contains the documentation website for SVGFusion, built with [Docusaurus](https://docusaurus.io/).

## 🚀 Quick Start

```bash
cd docs
npm install
npm start
```

This starts a local development server and opens up a browser window.

## 📦 Build

```bash
npm run build
```

This command generates static content into the `build` directory.

## 🌐 Netlify Deployment

The documentation is automatically deployed to Netlify after each release.

### Manual Setup

1. **Create a Netlify site** from your GitHub repository
2. **Configure build settings:**

   - Build command: `cd docs && npm run build`
   - Publish directory: `docs/build`
   - Node version: `20`

3. **Add environment variables** to your GitHub repository secrets:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
   - `NETLIFY_SITE_ID`: Your Netlify site ID

### Automatic Deployment

The documentation deploys automatically:

- ✅ After each release (via semantic-release)
- ✅ Manual trigger via GitHub Actions
- ✅ Preview deployments for pull requests

## 🎨 Features

- **Interactive Playground** - Live SVG to React/Vue conversion
- **Comprehensive Docs** - Complete API and CLI documentation
- **Dark Mode Support** - Beautiful cyan theme in both modes
- **Responsive Design** - Works on all devices
- **Search** - Built-in documentation search

## 🛠 Development

### Adding New Documentation

1. Create markdown files in `docs/`
2. Update `sidebars.ts` to include new pages
3. Test locally with `npm start`

### Customizing Theme

- Edit `src/css/custom.css` for styling
- Modify `docusaurus.config.ts` for configuration
- Update components in `src/components/`

## 📁 Structure

```
docs/
├── docs/                    # Documentation pages
│   ├── getting-started.md
│   ├── cli-usage.md
│   └── api-reference.md
├── src/
│   ├── components/          # React components
│   ├── css/                 # Custom styles
│   └── pages/               # Custom pages
│       ├── index.tsx        # Homepage
│       └── playground.tsx   # Interactive playground
├── static/                  # Static assets
├── docusaurus.config.ts     # Docusaurus configuration
└── sidebars.ts             # Sidebar navigation
```
