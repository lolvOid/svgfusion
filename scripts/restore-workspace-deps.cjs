const fs = require('fs');
const path = require('path');

const packagesDir = path.resolve(__dirname, '../packages');
const target = process.argv[2]; // e.g., 'svgfusion'

if (!target) {
  console.error('❌ Usage: node scripts/restore-workspace-deps.js <packageName>');
  process.exit(1);
}

// Map package names to their actual folder names
const packageFolderMap = {
  'svgfusion': 'svgfusion-bundle'
};

const folderName = packageFolderMap[target] || target;
const pkgPath = path.join(packagesDir, folderName, 'package.json');

try {
  // Read current package.json (with new version from semantic-release)
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  
  // List of all internal svgfusion packages that should use workspace:*
  const internalDeps = [
    'svgfusion',        // Published name of svgfusion-bundle
    'svgfusion-bundle', // Folder name 
    'svgfusion-core',
    'svgfusion-utils', 
    'svgfusion-cmd',
    'svgfusion-react',
    'svgfusion-vue',
    'svgfusion-dom'
  ];
  
  let hasChanges = false;
  
  // Restore workspace references for internal dependencies only
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
    const deps = pkg[depType];
    if (!deps) return;
    
    for (const dep of internalDeps) {
      if (deps[dep] && !deps[dep].startsWith('workspace:')) {
        const oldVersion = deps[dep];
        deps[dep] = 'workspace:*';
        console.log(`[${target}] ${dep}@${oldVersion} → workspace:*`);
        hasChanges = true;
      }
    }
  });
  
  if (hasChanges) {
    // Write back with workspace references but keep the new version
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(`✅ ${target}/package.json dependencies restored to workspace format (version preserved)`);
  } else {
    console.log(`ℹ️ No workspace dependencies to restore for ${target}`);
  }
} catch (error) {
  console.error(`❌ Failed to restore ${target}/package.json:`, error.message);
  process.exit(1);
}