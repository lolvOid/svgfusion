import React from 'react';
import Layout from '@theme/Layout';
import Playground from '@site/src/components/Playground';

export default function PlaygroundPage() {
  return (
    <Layout
      title="SVGFusion Playground"
      description="Interactive playground for converting SVG to React and Vue components"
    >
      <div style={{ padding: '20px', maxWidth: '100%', flex: 1 }}>
        <div style={{ marginBottom: '20px' }}>
          <h1>SVGFusion Playground</h1>
        </div>
        <Playground />
      </div>
    </Layout>
  );
}
