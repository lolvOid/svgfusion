#!/usr/bin/env node

const { readSvgDirectory, writeComponentFile } = require('svgfusion-utils');
const { SVGFusion, generateIndexFile } = require('svgfusion-core');

const fs = require('fs');
const path = require('path');
const { VueGenerator } = require('svgfusion');

async function generateVueIcons() {
  try {
    const svgFiles = await readSvgDirectory('./svgs', true);
    console.log(`📁 Found ${svgFiles.length} SVG files`);

    const results = [];
    const outputDir = './demo-vue/src/components/icons';

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
            namedExport: true,
            componentName: componentName,
            typescript: true,
            compositionApi: true,
            scriptSetup: true,
          },
        };
        const fusion = new SVGFusion();
        const result = await fusion.convert(svgContent, options, VueGenerator);
        const outputPath = path.join(outputDir, result.filename);
        await writeComponentFile(outputPath, result.code);

        console.log(`   ✅ Generated: ${result.componentName}.vue`);

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
        framework: 'vue',
      });

      await writeComponentFile(path.join(outputDir, 'index.ts'), indexContent);
      console.log('📦 Generated index.ts');
    }

    console.log(`🎉 Generated ${results.length} Vue icons!`);
    return results;
  } catch (error) {
    console.error('❌ Vue icon generation failed:', error);
    throw error;
  }
}

if (require.main === module) {
  generateVueIcons();
}

module.exports = { generateVueIcons };
