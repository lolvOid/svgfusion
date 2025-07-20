const fs = require('fs');
const path = require('path');

const packagesDir = path.resolve(__dirname, '../packages');
const target = process.argv[2]; // e.g., 'svgfusion-utils'

if (!target) {
  console.error('❌ Usage: node scripts/restore-workspace-deps.js <packageName>');
  process.exit(1);
}

const pkgPath = path.join(packagesDir, target, 'package.json');
const backupPath = pkgPath + '.workspace-backup';

if (fs.existsSync(backupPath)) {
  // Restore the original package.json (with original version and workspace deps)
  fs.copyFileSync(backupPath, pkgPath);
  fs.unlinkSync(backupPath); // Clean up backup
  console.log(`✅ ${target}/package.json restored to workspace format (version reset)`);
} else {
  console.log(`ℹ️ No backup found for ${target}/package.json`);
}