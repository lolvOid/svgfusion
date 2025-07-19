#!/usr/bin/env node

const { readSvgDirectory, writeComponentFile } = require('svgfusion-utils');
const { generateIndexFile, SVGFusion } = require('svgfusion-core');
const { ReactGenerator } = require('svgfusion-react');

const fs = require('fs');
const path = require('path');

async function generateReactIcons() {
  try {
    const svgFiles = await readSvgDirectory('./svgs', true);
    console.log(`📁 Found ${svgFiles.length} SVG files`);

    const results = [];
    const outputDir = './demo-react/src/components/icons';

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Process each SVG file
    for (const svgFile of svgFiles) {
      try {
        const fileName = path.basename(svgFile);
        console.log(`📄 Processing: ${fileName}`);

        const svgContent = fs.readFileSync(svgFile, 'utf-8');
        const componentName = path.basename(svgFile, '.svg');

        console.log(`   📝 Component name: ${componentName}`);

        const options = {
          transformation: {
            splitColors: true,
            splitStrokeWidths: true,
            fixedStrokeWidth: true,
            accessibility: true,
            normalizeFillStroke: true,
          },
          generator: {
            prefix: 'Demo',
            suffix: 'Icon',
            componentName: componentName,
            typescript: true,
            memo: true,
            forwardRef: true,
            nativeProps: true,
          },
        };
        const fusion = new SVGFusion();
        const result = await fusion.convert(
          svgContent,
          options,
          ReactGenerator
        );

        console.log(`   📦 Result filename: ${result.filename}`);

        const outputPath = path.join(outputDir, result.filename);
        await writeComponentFile(outputPath, result.code);

        console.log(`   ✅ Generated: ${result.componentName}.tsx`);

        results.push({
          ...result,
          sourceFile: svgFile,
          outputFile: outputPath,
        });
      } catch (error) {
        console.error(`   ❌ Error processing ${svgFile}:`, error.message);
      }
    }

    // Generate index file
    if (results.length > 0) {
      const indexContent = generateIndexFile(results, {
        format: 'ts',
        exportType: 'named',
        typescript: true,
        framework: 'react',
      });

      await writeComponentFile(path.join(outputDir, 'index.ts'), indexContent);
      console.log('📦 Generated index.ts');
    }

    console.log(`🎉 Generated ${results.length} React icons!`);
    return results;
  } catch (error) {
    console.error('❌ React icon generation failed:', error);
    throw error;
  }
}

if (require.main === module) {
  generateReactIcons();
}

module.exports = { generateReactIcons };
