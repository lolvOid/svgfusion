import { transform } from '@svgr/core';
import { ReactConversionOptions, ConversionResult } from '../types/index.js';
import { optimizeSvg } from '../utils/svgo.js';
import { formatComponentName } from '../utils/name.js';
import { getFileExtension, getComponentFilename } from '../utils/files.js';

/**
 * Convert SVG to React component
 * @param svgContent - SVG content string
 * @param options - Conversion options
 * @returns Conversion result with React component code
 */
export async function convertToReact(
  svgContent: string,
  options: ReactConversionOptions = {}
): Promise<ConversionResult> {
  const {
    name,
    prefix,
    suffix,
    optimize = true,
    typescript = true,
    memo = true,
    ref = true,
    titleProp = true,
    descProp = true,
  } = options;

  try {
    // Optimize SVG if requested
    let processedSvg = svgContent;
    if (optimize) {
      processedSvg = optimizeSvg(svgContent);
    }

    // Generate component name
    const baseName = name || 'icon';
    const componentName = formatComponentName(baseName, prefix, suffix);

    // SVGR transformation options
    const svgrOptions = {
      typescript,
      memo,
      ref,
      titleProp,
      descProp,
      svgProps: {
        className: '{className}',
      },
    };

    // Transform SVG to React component
    let result = await transform(processedSvg, svgrOptions, {
      componentName,
    });

    // Add proper exports to the result
    const typeImports = typescript ? `import { SVGProps } from 'react';\n` : '';

    const memoImport = memo ? `import { memo } from 'react';\n` : '';
    const refImport = ref ? `import { forwardRef } from 'react';\n` : '';

    const exports = `\nexport default ${componentName};\nexport { ${componentName} };`;

    // Wrap the SVGR result with proper component structure
    const propsType = typescript
      ? `SVGProps<SVGSVGElement> & { className?: string; }`
      : '';

    const componentProps = typescript ? `props: ${propsType}` : 'props';

    const componentFunc = memo ? `memo(` : '';
    const refWrapper = ref ? `forwardRef<SVGSVGElement, ${propsType}>(` : '';
    const closingWrappers = `${ref ? ')' : ''}${memo ? ')' : ''}`;

    result = `${typeImports}${memoImport}${refImport}
const ${componentName} = ${componentFunc}${refWrapper}(${componentProps}) => {
  return ${result};
}${closingWrappers};

${componentName}.displayName = "${componentName}";
${exports}`;

    // Generate filename
    const extension = getFileExtension('react', typescript);
    const filename = getComponentFilename('icon.svg', componentName, extension);

    return {
      code: result,
      filename,
      componentName,
    };
  } catch (error) {
    throw new Error(`Failed to convert SVG to React: ${error}`);
  }
}
