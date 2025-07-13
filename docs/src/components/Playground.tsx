import React, { useState, useEffect, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { vue } from '@codemirror/lang-vue';
import { githubDarkInit, githubLightInit } from '@uiw/codemirror-theme-github';
import { EditorView, scrollPastEnd } from '@codemirror/view';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import {
  Copy,
  Download,
  Palette,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  SVGFusionBrowser,
  validateSvg,
  formatComponentName,
  sanitizeComponentName,
} from 'svgfusion/browser';
import { z } from 'zod';
import { DEFAULT_SVG } from './defaultSvg';

interface PlaygroundOptions {
  framework: 'react' | 'vue';
  typescript: boolean;
  componentName: string;
  prefix: string;
  suffix: string;
  splitColors: boolean;
  splitStrokeWidths: boolean;
  fixedStrokeWidth: boolean;
  memo: boolean;
  forwardRef: boolean;
  sfc: boolean;
  scriptSetup: boolean;
  extractColors: boolean;
}

// Zod validation schema for component naming
const componentNamingSchema = z.object({
  componentName: z
    .string()
    .min(1, 'Component name is required')
    .regex(
      /^[a-zA-Z][a-zA-Z0-9-_]*$/,
      'Component name must start with a letter and contain only letters, numbers, hyphens, and underscores'
    ),
  prefix: z.string().optional().default(''),
  suffix: z.string().optional().default(''),
});

type ComponentNamingValidation = {
  isValid: boolean;
  hasWarnings: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
};

const DEFAULT_OPTIONS: PlaygroundOptions = {
  framework: 'react',
  typescript: true,
  componentName: 'weather-icon',
  prefix: '',
  suffix: '',
  splitColors: false,
  splitStrokeWidths: false,
  fixedStrokeWidth: false,
  memo: false,
  forwardRef: false,
  sfc: true,
  scriptSetup: true,
  extractColors: false,
};

// Helper function to format conversion time
const formatConversionTime = (time: number): string => {
  if (time < 1000) {
    return `${time.toFixed(1)}ms`;
  } else {
    return `${(time / 1000).toFixed(2)}s`;
  }
};

export default function Playground() {
  // Custom theme detection (fallback for when useColorMode is not available)
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');

  // Mobile responsive hook
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // Mobile breakpoint at 768px
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [svgInput, setSvgInput] = useState(DEFAULT_SVG);
  const [options, setOptions] = useState<PlaygroundOptions>(DEFAULT_OPTIONS);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [validation, setValidation] = useState<{
    valid: boolean;
    errors: string[];
  }>({ valid: true, errors: [] });
  const [componentNamingValidation, setComponentNamingValidation] =
    useState<ComponentNamingValidation>({
      isValid: true,
      hasWarnings: false,
      errors: {},
      warnings: {},
    });

  // Validate component naming
  const validateComponentNaming = (
    componentName: string,
    prefix: string,
    suffix: string
  ): ComponentNamingValidation => {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    // Validate component name (required)
    if (!componentName.trim()) {
      errors.componentName = 'Component name is required';
    } else if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(componentName)) {
      errors.componentName =
        'Component name must start with a letter and contain only letters, numbers, hyphens, and underscores';
    }

    // Validate prefix (optional but warn if sanitized)
    if (prefix) {
      const sanitizedPrefix = sanitizeComponentName(prefix, 'prefix');
      if (sanitizedPrefix === '') {
        warnings.prefix = `Prefix "${prefix}" will be removed (must start with a letter)`;
      } else if (sanitizedPrefix !== prefix) {
        warnings.prefix = `Prefix "${prefix}" will become "${sanitizedPrefix}" (symbols removed)`;
      }
    }

    // Validate suffix (optional but warn if sanitized)
    if (suffix) {
      const sanitizedSuffix = sanitizeComponentName(suffix, 'suffix');
      if (sanitizedSuffix === '') {
        warnings.suffix = `Suffix "${suffix}" will be removed (invalid characters)`;
      } else if (sanitizedSuffix !== suffix) {
        warnings.suffix = `Suffix "${suffix}" will become "${sanitizedSuffix}" (symbols removed)`;
      }
    }

    const hasErrors = Object.keys(errors).length > 0;
    const hasWarnings = Object.keys(warnings).length > 0;

    return {
      isValid: !hasErrors,
      hasWarnings,
      errors,
      warnings,
    };
  };

  // Create SVGFusion browser instance
  const svgfusion = useMemo(() => {
    return new SVGFusionBrowser();
  }, []); // Initial conversion on mount
  useEffect(() => {
    const convertInitial = async () => {
      try {
        const startTime = performance.now();

        // First validate the SVG
        const validationResult = validateSvg(DEFAULT_SVG);
        setValidation(validationResult);

        if (!validationResult.valid) {
          setError('Default SVG validation failed');
          setOutput('// Error: Default SVG validation failed');
          return;
        }

        const result = await svgfusion.convert(DEFAULT_SVG, {
          framework: 'react',
          typescript: true,
          componentName: 'MyIcon',
          splitColors: false,
          splitStrokeWidths: false,
          fixedStrokeWidth: false,
          optimize: true,
          memo: false,
          forwardRef: false,
        });
        const endTime = performance.now();
        const duration = endTime - startTime;
        setConversionTime(duration);

        setOutput(result.code);

        // Extract colors for initial SVG
        const colors = svgfusion.extractColors(DEFAULT_SVG);
        setColors(colors);
      } catch (error) {
        console.error('Initial conversion failed:', error);
        setError('Failed to convert default SVG');
        setOutput('// Error: Failed to convert default SVG');
        setValidation({
          valid: false,
          errors: ['Failed to convert default SVG'],
        });
      }
    };
    convertInitial();
  }, [svgfusion]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionTime, setConversionTime] = useState<number | null>(null);

  // Component naming validation effect
  useEffect(() => {
    const validation = validateComponentNaming(
      options.componentName,
      options.prefix,
      options.suffix
    );
    setComponentNamingValidation(validation);
  }, [options.componentName, options.prefix, options.suffix]);

  // Real-time validation effect (separate from conversion)
  useEffect(() => {
    if (!svgInput.trim()) {
      setValidation({ valid: false, errors: ['No SVG content'] });
      return;
    }

    try {
      const validationResult = validateSvg(svgInput);
      setValidation(validationResult);
    } catch (error) {
      setValidation({ valid: false, errors: ['Validation failed'] });
    }
  }, [svgInput]); // Only depends on svgInput, runs on every input change

  // Memoized editor theme configuration - following CodeMirror docs for scrollbars
  const editorThemeConfig = useMemo(() => {
    return EditorView.theme({
      '&': {
        height: '670px', // Fixed height as required by CodeMirror for scrollbars
        fontSize: isMobile ? '13px' : '14px',
      },
      '.cm-scroller': {
        overflow: 'auto', // Enable scrollbars as per CodeMirror docs
        fontFamily: 'inherit',
      },
      '.cm-content': {
        padding: '10px 0',
      },
      '.cm-focused': {
        outline: 'none',
      },
    });
  }, [isMobile]);

  // Memoized extensions for SVG input editor
  const svgEditorExtensions = useMemo(
    () => [xml(), EditorView.lineWrapping, scrollPastEnd(), editorThemeConfig],
    [editorThemeConfig]
  );

  // Memoized extensions for output editor
  const outputEditorExtensions = useMemo(
    () => [
      options.framework === 'vue'
        ? vue({
            base: html(),
          })
        : javascript({ jsx: true, typescript: options.typescript }),
      EditorView.lineWrapping,
      scrollPastEnd(),
      editorThemeConfig,
    ],
    [options.framework, editorThemeConfig]
  );

  // Memoized theme configurations
  const editorTheme = useMemo(
    () =>
      colorMode === 'dark'
        ? githubDarkInit({ theme: 'dark' })
        : githubLightInit({ theme: 'light' }),
    [colorMode]
  );

  // Stable basic setup configuration to prevent re-renders
  const stableBasicSetup = useMemo(
    () => ({
      lineNumbers: true,
      foldGutter: true,
      dropCursor: false,
      allowMultipleSelections: false,
      indentOnInput: true,
      bracketMatching: true,
      closeBrackets: true,
      autocompletion: true,
      highlightSelectionMatches: false, // Prevent selection-based re-renders
    }),
    []
  );

  // Detect theme changes
  useEffect(() => {
    const detectTheme = () => {
      // Check for Docusaurus theme data attribute
      const htmlElement = document.documentElement;
      const theme = htmlElement.getAttribute('data-theme');
      if (theme === 'dark' || theme === 'light') {
        setColorMode(theme);
        return;
      }

      // Fallback to system preference
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        setColorMode('dark');
      } else {
        setColorMode('light');
      }
    };

    // Initial detection
    detectTheme();

    // Watch for theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-theme'
        ) {
          detectTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Also listen to system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      // Only use system theme if no explicit theme is set
      if (!document.documentElement.getAttribute('data-theme')) {
        detectTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Theme colors
  const themeColors = {
    background: colorMode === 'dark' ? '#1e1e1e' : '#ffffff',
    panelBackground: colorMode === 'dark' ? '#252526' : '#f8f9fa',
    headerBackground: colorMode === 'dark' ? '#2d2d30' : '#fafafa',
    borderColor: colorMode === 'dark' ? '#3e3e42' : '#e0e0e0',
    textColor: colorMode === 'dark' ? '#cccccc' : '#333333',
    mutedColor: colorMode === 'dark' ? '#969696' : '#666666',
    errorColor: colorMode === 'dark' ? '#f85149' : '#dc3545',
    successColor: colorMode === 'dark' ? '#56d364' : '#28a745',
    warningColor: colorMode === 'dark' ? '#f0883e' : '#ffc107',
  };

  // Add CSS for spinner animation
  useEffect(() => {
    const styleId = 'playground-spinner-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Convert playground options to browser API options
  const mapOptionsToBrowserAPI = (opts: PlaygroundOptions) => {
    return {
      typescript: opts.typescript,
      componentName: opts.componentName, // Library will handle formatting with prefix/suffix
      prefix: opts.prefix || undefined,
      suffix: opts.suffix || undefined,
      splitColors: opts.splitColors,
      splitStrokeWidths: opts.splitStrokeWidths,
      fixedStrokeWidth: opts.fixedStrokeWidth,
      optimize: true,
      ...(opts.framework === 'react' && {
        memo: opts.memo,
        forwardRef: opts.forwardRef,
      }),
      ...(opts.framework === 'vue' && {
        sfc: opts.sfc,
        scriptSetup: opts.scriptSetup,
      }),
    };
  };

  // Real-time conversion effect
  useEffect(() => {
    if (!svgInput.trim()) {
      setOutput('// Paste your SVG code here to see the generated component');
      setValidation({ valid: false, errors: ['No SVG content'] });
      setColors([]);
      return;
    }

    const convertRealtime = async () => {
      const startTime = performance.now();
      setIsConverting(true);
      setError(null);

      try {
        // Check validation state (updated by separate validation effect)
        if (!validation.valid) {
          setOutput(
            `// Error: Invalid SVG\n// ${validation.errors.join('\n// ')}`
          );
          setColors([]);
          setIsConverting(false);
          setConversionTime(null);
          return;
        }

        // Check component naming validation - only errors should block conversion
        if (!componentNamingValidation.isValid) {
          const errorMessages = Object.values(componentNamingValidation.errors);
          setOutput(
            `// Error: Invalid component naming\n// ${errorMessages.join('\n// ')}`
          );
          setColors([]);
          setIsConverting(false);
          setConversionTime(null);
          return;
        }

        // Convert after validation check
        const browserOptions = {
          framework: options.framework,
          ...mapOptionsToBrowserAPI(options),
        };

        const result = await svgfusion.convert(svgInput, browserOptions);

        const endTime = performance.now();
        const duration = endTime - startTime;
        setConversionTime(duration);

        setOutput(result.code);

        // Extract colors
        try {
          const extractedColors = svgfusion.extractColors(svgInput);
          setColors(extractedColors);
        } catch (colorError) {
          setColors([]);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Conversion failed';
        setError(errorMessage);
        setOutput(`// Error: ${errorMessage}\n// Please check your SVG syntax`);
        setValidation({ valid: false, errors: [errorMessage] });
        setColors([]);
        setConversionTime(null);
      } finally {
        setIsConverting(false);
      }
    };

    // Debounce the conversion to avoid excessive calls
    const timeoutId = setTimeout(convertRealtime, 300);
    return () => clearTimeout(timeoutId);
  }, [svgInput, options, svgfusion, validation, componentNamingValidation]);

  // Extract colors and validate SVG when input changes (handled in real-time conversion)
  // This effect is now redundant since real-time conversion handles it

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      // Could add toast notification here
    } catch (err) {
      // Silent fail for copy operations
    }
  };

  const handleDownload = () => {
    const extension =
      options.framework === 'vue' && options.sfc
        ? 'vue'
        : options.typescript
          ? 'tsx'
          : 'jsx';

    // Generate the full component name with sanitized prefix/suffix
    const componentNameWithPrefixSuffix = formatComponentName(
      options.componentName,
      options.prefix,
      options.suffix
    );

    const filename = `${componentNameWithPrefixSuffix}.${extension}`;

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateOption = <K extends keyof PlaygroundOptions>(
    key: K,
    value: PlaygroundOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="playground-container"
      style={{
        height: isMobile ? '90vh' : '80vh',
        minHeight: isMobile ? '500px' : '600px',
        border: `1px solid ${themeColors.borderColor}`,
        borderRadius: '8px',
        backgroundColor: themeColors.background,
        color: themeColors.textColor,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="playground-header"
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${themeColors.borderColor}`,
          backgroundColor: themeColors.headerBackground,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: '600',
            color: themeColors.textColor,
            lineHeight: isMobile ? '1.4' : '1.2',
          }}
        >
          {isMobile
            ? 'Convert SVG to React/Vue components'
            : 'Convert SVG files to React and Vue components in real-time.'}
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginLeft: 'auto',
          }}
        >
          {validation.valid && componentNamingValidation.isValid ? (
            <CheckCircle
              size={16}
              style={{ color: themeColors.successColor }}
            />
          ) : (
            <AlertCircle size={16} style={{ color: themeColors.errorColor }} />
          )}
          <span
            style={{
              fontSize: '14px',
              color:
                validation.valid && componentNamingValidation.isValid
                  ? themeColors.successColor
                  : themeColors.errorColor,
            }}
          >
            {validation.valid && componentNamingValidation.isValid
              ? 'Valid'
              : !validation.valid
                ? 'Invalid SVG'
                : 'Invalid Component Name'}
          </span>
        </div>
      </div>

      <PanelGroup
        direction={isMobile ? 'vertical' : 'horizontal'}
        style={{
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Input Panel */}
        <Panel defaultSize={isMobile ? 35 : 40} minSize={isMobile ? 25 : 30}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: themeColors.panelBackground,
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: `1px solid ${themeColors.borderColor}`,
                backgroundColor: themeColors.headerBackground,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontWeight: '500', color: themeColors.textColor }}>
                Paste your SVG code
              </span>
              {colors.length > 0 && (
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Palette
                    size={14}
                    style={{ color: themeColors.mutedColor }}
                  />
                  <span
                    style={{ fontSize: '12px', color: themeColors.mutedColor }}
                  >
                    {colors.length} color{colors.length !== 1 ? 's' : ''}{' '}
                    detected
                  </span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {colors.slice(0, 6).map((color, i) => (
                      <div
                        key={i}
                        style={{
                          width: '14px',
                          height: '14px',
                          backgroundColor: color,
                          borderRadius: '3px',
                          border: `1px solid ${themeColors.borderColor}`,
                          cursor: 'pointer',
                        }}
                        title={`${color} (click to copy)`}
                        onClick={() => navigator.clipboard.writeText(color)}
                      />
                    ))}
                    {colors.length > 6 && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: themeColors.mutedColor,
                          marginLeft: '2px',
                        }}
                      >
                        +{colors.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                flex: 1,
                position: 'relative',
                minHeight: 0, // Allow flex item to shrink
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CodeMirror
                key="svg-editor"
                value={svgInput}
                onChange={value => setSvgInput(value)}
                extensions={svgEditorExtensions}
                theme={editorTheme}
                basicSetup={stableBasicSetup}
              />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle
          style={{
            width: isMobile ? '100%' : '6px',
            height: isMobile ? '6px' : '100%',
            backgroundColor: themeColors.borderColor,
            cursor: isMobile ? 'row-resize' : 'col-resize',
          }}
        />

        {/* Options Panel */}
        <Panel
          defaultSize={isMobile ? 30 : 20}
          minSize={isMobile ? 20 : 20}
          collapsible={!isMobile}
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: themeColors.panelBackground,
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: `1px solid ${themeColors.borderColor}`,
                backgroundColor: themeColors.headerBackground,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontWeight: '500', color: themeColors.textColor }}>
                Options
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: isConverting
                    ? themeColors.mutedColor
                    : themeColors.mutedColor,
                }}
              >
                {isConverting && (
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      border: `2px solid ${themeColors.mutedColor}`,
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                )}
                <span>
                  {isConverting
                    ? 'Converting...'
                    : conversionTime !== null
                      ? `Ready (${formatConversionTime(conversionTime)})`
                      : 'Ready'}
                </span>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                padding: isMobile ? '12px' : '16px',
                overflowY: 'auto',
                backgroundColor: themeColors.panelBackground,
              }}
            >
              {/* Framework Selection */}
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: themeColors.textColor,
                  }}
                >
                  Framework
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['react', 'vue'].map(fw => (
                    <label
                      key={fw}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: themeColors.textColor,
                      }}
                    >
                      <input
                        type="radio"
                        name="framework"
                        value={fw}
                        checked={options.framework === fw}
                        onChange={e =>
                          updateOption(
                            'framework',
                            e.target.value as 'react' | 'vue'
                          )
                        }
                      />
                      {fw.charAt(0).toUpperCase() + fw.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Component Name */}
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: themeColors.textColor,
                  }}
                >
                  Component Name *
                </label>
                <input
                  type="text"
                  value={options.componentName}
                  onChange={e => updateOption('componentName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: `1px solid ${
                      componentNamingValidation.errors.componentName
                        ? themeColors.errorColor
                        : themeColors.borderColor
                    }`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: themeColors.background,
                    color: themeColors.textColor,
                    outline: 'none',
                  }}
                />
                {componentNamingValidation.errors.componentName && (
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '12px',
                      color: themeColors.errorColor,
                    }}
                  >
                    {componentNamingValidation.errors.componentName}
                  </div>
                )}
              </div>

              {/* Prefix */}
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: themeColors.textColor,
                  }}
                >
                  Prefix
                </label>
                <input
                  type="text"
                  value={options.prefix}
                  onChange={e => updateOption('prefix', e.target.value)}
                  placeholder="e.g., Icon"
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: `1px solid ${
                      componentNamingValidation.errors.prefix
                        ? themeColors.errorColor
                        : componentNamingValidation.warnings.prefix
                          ? themeColors.warningColor
                          : themeColors.borderColor
                    }`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: themeColors.background,
                    color: themeColors.textColor,
                    outline: 'none',
                  }}
                />
                {componentNamingValidation.errors.prefix && (
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '12px',
                      color: themeColors.errorColor,
                    }}
                  >
                    {componentNamingValidation.errors.prefix}
                  </div>
                )}
                {componentNamingValidation.warnings.prefix && (
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '12px',
                      color: themeColors.warningColor,
                    }}
                  >
                    Warning: {componentNamingValidation.warnings.prefix}
                  </div>
                )}
              </div>

              {/* Suffix */}
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: themeColors.textColor,
                  }}
                >
                  Suffix
                </label>
                <input
                  type="text"
                  value={options.suffix}
                  onChange={e => updateOption('suffix', e.target.value)}
                  placeholder="e.g., Svg"
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: `1px solid ${
                      componentNamingValidation.errors.suffix
                        ? themeColors.errorColor
                        : componentNamingValidation.warnings.suffix
                          ? themeColors.warningColor
                          : themeColors.borderColor
                    }`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: themeColors.background,
                    color: themeColors.textColor,
                    outline: 'none',
                  }}
                />
                {componentNamingValidation.errors.suffix && (
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '12px',
                      color: themeColors.errorColor,
                    }}
                  >
                    {componentNamingValidation.errors.suffix}
                  </div>
                )}
                {componentNamingValidation.warnings.suffix && (
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '12px',
                      color: themeColors.warningColor,
                    }}
                  >
                    Warning: {componentNamingValidation.warnings.suffix}
                  </div>
                )}
              </div>
              {/* Boolean Options */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? '16px' : '12px',
                }}
              >
                {[
                  {
                    key: 'typescript',
                    label: 'TypeScript',
                    tooltip:
                      'Generate TypeScript component with type definitions',
                  },
                  {
                    key: 'splitColors',
                    label: 'Multi Colors',
                    tooltip: 'Extract colors as props for dynamic theming',
                  },
                  {
                    key: 'splitStrokeWidths',
                    label: 'Multi Stroke Widths',
                    tooltip:
                      'Extract stroke widths as props for dynamic styling',
                  },
                  {
                    key: 'fixedStrokeWidth',
                    label: 'Fixed Stroke Width',
                    tooltip: 'Make stroke width configurable via props',
                  },
                  ...(options.framework === 'react'
                    ? [
                        {
                          key: 'memo',
                          label: 'React.memo',
                          tooltip:
                            'Wrap component with React.memo for performance',
                        },
                        {
                          key: 'forwardRef',
                          label: 'Forward Ref',
                          tooltip: 'Enable ref forwarding to the SVG element',
                        },
                      ]
                    : [
                        {
                          key: 'scriptSetup',
                          label: 'Script Setup',
                          tooltip:
                            'Use Vue 3 script setup syntax for better readability',
                        },
                      ]),
                ].map(({ key, label, tooltip }) => (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: themeColors.textColor,
                      cursor: 'pointer',
                    }}
                    title={tooltip}
                  >
                    <input
                      type="checkbox"
                      checked={
                        options[key as keyof PlaygroundOptions] as boolean
                      }
                      onChange={e =>
                        updateOption(
                          key as keyof PlaygroundOptions,
                          e.target.checked
                        )
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>

              {/* SVG Preview */}
              {svgInput.trim() && (
                <div style={{ marginTop: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '500',
                      color: themeColors.textColor,
                    }}
                  >
                    SVG Preview
                  </label>
                  <div
                    style={{
                      padding: '16px',
                      border: `1px solid ${themeColors.borderColor}`,
                      borderRadius: '4px',
                      backgroundColor: themeColors.background,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '200px',
                      maxHeight: '200px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: svgInput }}
                      style={{
                        maxWidth: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '8px 12px',
                    backgroundColor:
                      colorMode === 'dark' ? '#2d1b1b' : '#fee2e2',
                    border: `1px solid ${colorMode === 'dark' ? '#4d2626' : '#fecaca'}`,
                    borderRadius: '4px',
                    color: themeColors.errorColor,
                    fontSize: '14px',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Validation Errors */}
              {!validation.valid && validation.errors.length > 0 && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '8px 12px',
                    backgroundColor:
                      colorMode === 'dark' ? '#2d2217' : '#fef3c7',
                    border: `1px solid ${colorMode === 'dark' ? '#4d3e1a' : '#fde68a'}`,
                    borderRadius: '4px',
                    color: themeColors.warningColor,
                    fontSize: '14px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: '500',
                      marginBottom: '4px',
                      color: themeColors.warningColor,
                    }}
                  >
                    SVG Validation Errors:
                  </div>
                  {validation.errors.map((err, i) => (
                    <div key={i}>• {err}</div>
                  ))}
                </div>
              )}

              {/* Component Naming Validation Errors */}
              {!componentNamingValidation.isValid && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '8px 12px',
                    backgroundColor:
                      colorMode === 'dark' ? '#2d1b1b' : '#fee2e2',
                    border: `1px solid ${colorMode === 'dark' ? '#4d2626' : '#fecaca'}`,
                    borderRadius: '4px',
                    color: themeColors.errorColor,
                    fontSize: '14px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: '500',
                      marginBottom: '4px',
                      color: themeColors.errorColor,
                    }}
                  >
                    Component Naming Errors:
                  </div>
                  {Object.values(componentNamingValidation.errors).map(
                    (err, i) => (
                      <div key={i}>• {err}</div>
                    )
                  )}
                </div>
              )}

              {/* Component Naming Warnings */}
              {componentNamingValidation.hasWarnings && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '8px 12px',
                    backgroundColor:
                      colorMode === 'dark' ? '#2d2217' : '#fef3c7',
                    border: `1px solid ${colorMode === 'dark' ? '#4d3e1a' : '#fde68a'}`,
                    borderRadius: '4px',
                    color: themeColors.warningColor,
                    fontSize: '14px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: '500',
                      marginBottom: '4px',
                      color: themeColors.warningColor,
                    }}
                  >
                    Component Naming Warnings:
                  </div>
                  {Object.values(componentNamingValidation.warnings).map(
                    (warning, i) => (
                      <div key={i}>• {warning}</div>
                    )
                  )}
                  <div
                    style={{ marginTop: '4px', fontSize: '12px', opacity: 0.8 }}
                  >
                    Component generation will continue with sanitized names.
                  </div>
                </div>
              )}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle
          style={{
            width: isMobile ? '100%' : '6px',
            height: isMobile ? '6px' : '100%',
            backgroundColor: themeColors.borderColor,
            cursor: isMobile ? 'row-resize' : 'col-resize',
          }}
        />

        {/* Output Panel */}
        <Panel defaultSize={isMobile ? 35 : 35} minSize={isMobile ? 25 : 30}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: themeColors.panelBackground,
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: `1px solid ${themeColors.borderColor}`,
                backgroundColor: themeColors.headerBackground,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <span
                  style={{ fontWeight: '500', color: themeColors.textColor }}
                >
                  Generated Component
                </span>
                {conversionTime !== null && (
                  <span
                    style={{
                      fontSize: '12px',
                      color: themeColors.mutedColor,
                      fontFamily: 'monospace',
                    }}
                  >
                    {formatConversionTime(conversionTime)}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: isMobile ? '6px' : '8px' }}>
                <button
                  onClick={handleCopy}
                  disabled={!output || !componentNamingValidation.isValid}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: isMobile ? '8px 10px' : '6px 12px',
                    backgroundColor:
                      !output || !componentNamingValidation.isValid
                        ? themeColors.mutedColor
                        : colorMode === 'dark'
                          ? '#059669'
                          : '#10b981',
                    color:
                      !output || !componentNamingValidation.isValid
                        ? themeColors.background
                        : 'white',
                    border: `1px solid ${!output || !componentNamingValidation.isValid ? themeColors.borderColor : 'transparent'}`,
                    borderRadius: '4px',
                    cursor:
                      !output || !componentNamingValidation.isValid
                        ? 'not-allowed'
                        : 'pointer',
                    opacity:
                      !output || !componentNamingValidation.isValid ? 0.6 : 1,
                    fontSize: isMobile ? '13px' : '14px',
                    minHeight: isMobile ? '44px' : 'auto',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Copy size={14} />
                  {isMobile ? '' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!output || !componentNamingValidation.isValid}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: isMobile ? '8px 10px' : '6px 12px',
                    backgroundColor:
                      !output || !componentNamingValidation.isValid
                        ? themeColors.mutedColor
                        : colorMode === 'dark'
                          ? '#4c1d95'
                          : '#6366f1',
                    color:
                      !output || !componentNamingValidation.isValid
                        ? themeColors.background
                        : 'white',
                    border: `1px solid ${!output || !componentNamingValidation.isValid ? themeColors.borderColor : 'transparent'}`,
                    borderRadius: '4px',
                    cursor:
                      !output || !componentNamingValidation.isValid
                        ? 'not-allowed'
                        : 'pointer',
                    opacity:
                      !output || !componentNamingValidation.isValid ? 0.6 : 1,
                    fontSize: isMobile ? '13px' : '14px',
                    minHeight: isMobile ? '44px' : 'auto',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Download size={14} />
                  {isMobile ? '' : 'Download'}
                </button>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                position: 'relative',
                minHeight: 0, // Allow flex item to shrink
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CodeMirror
                key={`output-editor-${options.framework}`}
                value={
                  output ||
                  '// Real-time conversion - your component will appear here'
                }
                editable={false}
                extensions={outputEditorExtensions}
                theme={editorTheme}
                basicSetup={stableBasicSetup}
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
