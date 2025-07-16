import React from 'react';

interface StructuredDataProps {
  type?: 'WebSite' | 'SoftwareApplication' | 'Organization';
}

export default function StructuredData({
  type = 'WebSite',
}: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
      name: 'SVGFusion',
      description:
        'Transform SVG files into production-ready React and Vue 3 components with TypeScript support, accessibility features, and customizable styling options.',
      url: 'https://svgfusion.netlify.app',
      image: 'https://svgfusion.netlify.app/img/og-image.jpg',
      author: {
        '@type': 'Organization',
        name: 'SVGFusion Team',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SVGFusion Team',
      },
    };

    if (type === 'SoftwareApplication') {
      return {
        ...baseData,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        downloadUrl: 'https://www.npmjs.com/package/svgfusion',
        softwareVersion: 'Latest',
        releaseNotes: 'https://github.com/lolvOid/svgfusion/releases',
      };
    }

    if (type === 'Organization') {
      return {
        '@type': 'Organization',
        '@context': 'https://schema.org',
        name: 'SVGFusion',
        url: 'https://svgfusion.netlify.app',
        logo: 'https://svgfusion.netlify.app/img/logo.png',
        description:
          'Open source tool for transforming SVG files into production-ready React and Vue components',
        sameAs: [
          'https://github.com/lolvOid/svgfusion',
          'https://www.npmjs.com/package/svgfusion',
        ],
      };
    }

    return baseData;
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
}
