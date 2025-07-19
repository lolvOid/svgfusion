const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packagesDir = path.resolve(__dirname, '../packages');
const target = process.argv[2]; // e.g., 'a'

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

const pkgPath = path.join(packagesDir, target, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

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

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log(`✅ ${target}/package.json updated`);
