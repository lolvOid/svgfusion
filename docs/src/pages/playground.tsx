import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import MonacoEditor from '@monaco-editor/react';

const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
</svg>`;

const convertToReactComponent = (svgContent: string, typescript: boolean = true): string => {
  // Simple SVG to React conversion (demo version)
  const cleanedSvg = svgContent
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace(/stroke-width/g, 'strokeWidth')
    .replace(/stroke-linecap/g, 'strokeLinecap')
    .replace(/stroke-linejoin/g, 'strokeLinejoin')
    .replace(/fill-rule/g, 'fillRule')
    .replace(/clip-rule/g, 'clipRule')
    .replace(/class=/g, 'className=');

  const imports = typescript 
    ? `import { SVGProps } from 'react';`
    : `import React from 'react';`;

  const propTypes = typescript
    ? `SVGProps<SVGSVGElement> & { className?: string; }`
    : `any`;

  const componentCode = typescript
    ? `interface Props extends ${propTypes} {}

const IconComponent = (props: Props) => {
  return (
    ${cleanedSvg}
  );
};`
    : `const IconComponent = (props) => {
  return (
    ${cleanedSvg}
  );
};`;

  return `${imports}

${componentCode}

export default IconComponent;`;
};

const convertToVueComponent = (svgContent: string, typescript: boolean = true): string => {
  const cleanedSvg = svgContent
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace(/xmlns="[^"]*"/g, '')
    .replace(/width="[^"]*"/g, '')
    .replace(/height="[^"]*"/g, '')
    .replace(/<svg/, '<svg v-bind="$attrs"')
    .replace(/class="([^"]*)"/g, 'class="$1"')
    .replace(/currentColor/g, 'currentColor');

  const scriptTag = typescript
    ? `<script setup lang="ts">
interface Props {
  class?: string;
  style?: string | Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  style: undefined,
});
</script>`
    : `<script setup>
const props = withDefaults(defineProps(), {
  class: '',
  style: undefined,
});
</script>`;

  return `${scriptTag}

<template>
  ${cleanedSvg}
</template>

<style scoped>
/* Add component-specific styles here */
</style>`;
};

export default function Playground(): JSX.Element {
  const [svgInput, setSvgInput] = useState(defaultSvg);
  const [framework, setFramework] = useState<'react' | 'vue'>('react');
  const [typescript, setTypescript] = useState(true);
  const [optimized, setOptimized] = useState(true);
  const [output, setOutput] = useState('');

  const convertSvg = useCallback(() => {
    try {
      let processedSvg = svgInput;
      
      // Simple optimization (demo version)
      if (optimized) {
        processedSvg = processedSvg
          .replace(/\s+/g, ' ')
          .replace(/>\s+</g, '><')
          .trim();
      }

      if (framework === 'react') {
        const result = convertToReactComponent(processedSvg, typescript);
        setOutput(result);
      } else {
        const result = convertToVueComponent(processedSvg, typescript);
        setOutput(result);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [svgInput, framework, typescript, optimized]);

  React.useEffect(() => {
    convertSvg();
  }, [convertSvg]);

  return (
    <Layout
      title="Playground"
      description="Interactive SVG to React/Vue component converter"
    >
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          padding: '1rem', 
          borderBottom: '1px solid var(--ifm-color-emphasis-200)',
          backgroundColor: 'var(--ifm-background-surface-color)',
        }}>
          <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>SVGFusion Playground</h1>
          <p style={{ margin: 0, marginBottom: '1rem', color: 'var(--ifm-color-emphasis-600)', fontSize: '0.9rem' }}>
            Note: This is a demo version. For full features and optimization, use the CLI: <code>npm install -g svgfusion</code>
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div>
              <label style={{ marginRight: '0.5rem' }}>Framework:</label>
              <select 
                value={framework} 
                onChange={(e) => setFramework(e.target.value as 'react' | 'vue')}
                style={{ padding: '0.25rem' }}
              >
                <option value="react">React</option>
                <option value="vue">Vue 3</option>
              </select>
            </div>
            <div>
              <label style={{ marginRight: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={typescript}
                  onChange={(e) => setTypescript(e.target.checked)}
                  style={{ marginRight: '0.25rem' }}
                />
                TypeScript
              </label>
            </div>
            <div>
              <label style={{ marginRight: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={optimized}
                  onChange={(e) => setOptimized(e.target.checked)}
                  style={{ marginRight: '0.25rem' }}
                />
                Optimize SVG
              </label>
            </div>
          </div>
        </div>
        
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={30}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                  padding: '0.5rem 1rem', 
                  borderBottom: '1px solid var(--ifm-color-emphasis-200)',
                  backgroundColor: 'var(--ifm-background-surface-color)',
                  fontWeight: 'bold',
                }}>
                  SVG Input
                </div>
                <div style={{ flex: 1 }}>
                  <MonacoEditor
                    height="100%"
                    language="xml"
                    value={svgInput}
                    onChange={(value) => setSvgInput(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                      formatOnPaste: true,
                      formatOnType: true,
                    }}
                  />
                </div>
              </div>
            </Panel>
            
            <PanelResizeHandle style={{ width: '2px', backgroundColor: 'var(--ifm-color-emphasis-200)' }} />
            
            <Panel defaultSize={50} minSize={30}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                  padding: '0.5rem 1rem', 
                  borderBottom: '1px solid var(--ifm-color-emphasis-200)',
                  backgroundColor: 'var(--ifm-background-surface-color)',
                  fontWeight: 'bold',
                }}>
                  {framework === 'react' ? 'React' : 'Vue 3'} Component {typescript ? '(TypeScript)' : '(JavaScript)'}
                </div>
                <div style={{ flex: 1 }}>
                  <MonacoEditor
                    height="100%"
                    language={framework === 'react' ? (typescript ? 'typescript' : 'javascript') : 'vue'}
                    value={output}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                    }}
                  />
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </div>
        
        <div style={{ 
          padding: '1rem', 
          borderTop: '1px solid var(--ifm-color-emphasis-200)',
          backgroundColor: 'var(--ifm-background-surface-color)',
          textAlign: 'center',
        }}>
          <button 
            onClick={() => navigator.clipboard.writeText(output)}
            className="button button--secondary button--lg"
            style={{ 
              marginRight: '1rem',
            }}
          >
            Copy Component Code
          </button>
          <button 
            onClick={convertSvg}
            className="button button--outline button--secondary button--lg"
          >
            Refresh
          </button>
        </div>
      </div>
    </Layout>
  );
}