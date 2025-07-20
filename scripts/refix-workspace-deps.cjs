const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packagesDir = path.resolve(__dirname, '../packages');
const target = process.argv[2]; // e.g., 'svgfusion'

if (!target) {
  console.error(
    '❌ Usage: node scripts/replace-workspace-deps.js <packageName>'
  );
  process.exit(1);
}

const getPublishedVersion = pkgName => {
  try {
    return execSync(`npm show ${pkgName} version`).toString().trim();
  } catch (e) {
    console.warn(`⚠️  Could not find published version for "${pkgName}"`);
    return null;
  }
};

// Map package names to their actual folder names
const packageFolderMap = {
  'svgfusion': 'svgfusion-bundle'
};

const folderName = packageFolderMap[target] || target;
console.log(`Target: ${target}, Folder: ${folderName}`);
const pkgPath = path.join(packagesDir, folderName, 'package.json');
console.log(`Looking for package.json at: ${pkgPath}`);
const originalPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const pkg = JSON.parse(JSON.stringify(originalPkg)); // Deep copy

['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
  const deps = pkg[depType];
  if (!deps) return;

  for (const [dep, version] of Object.entries(deps)) {
    if (version.startsWith('workspace:')) {
      const actualVersion = getPublishedVersion(dep);
      if (actualVersion) {
        deps[dep] = actualVersion;
        console.log(`[${target}] ${dep}@workspace:* → ${actualVersion}`);
      } else {
        console.warn(
          `[${target}] ⚠️ No published version found for ${dep}, leaving as is.`
        );
      }
    }
  }
});

// Write the fixed package.json for npm publishing
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log(`✅ ${target}/package.json updated (will be restored via git after release)`);
