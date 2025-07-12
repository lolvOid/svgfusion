#!/usr/bin/env node

const {
  convertToVue,
  readSvgDirectory,
  writeComponentFile,
  generateIndexFile,
  svgToComponentName,
} = require('../dist/index.js');

const fs = require('fs');
const path = require('path');

async function generateVueIcons() {
  try {
    const svgFiles = await readSvgDirectory('./svgs', true);
    console.log(`📁 Found ${svgFiles.length} SVG files`);

    const results = [];
    const outputDir = './vue-demo/src/components/icons';

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
        const componentName = svgToComponentName(
          path.basename(svgFile, '.svg')
        );

        const result = await convertToVue(svgContent, {
          transformation: {
            splitColors: true,
            isFixedStrokeWidth: true,
          },
          generator: {
            componentName: componentName,
            typescript: true,
            compositionApi: true,
            scriptSetup: true,
          },
        });

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
