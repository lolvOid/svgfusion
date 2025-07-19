const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const packageName = process.argv[2];
if (!packageName) {
  console.error('Usage: node zip-asset.cjs <packageName>');
  process.exit(1);
}

const packageDir = path.resolve('packages', packageName);
const distDir = path.join(packageDir, 'dist');

if (!fs.existsSync(distDir)) {
  console.error(`dist folder not found in package "${packageName}"`);
  process.exit(1);
}

const pkgJson = JSON.parse(
  fs.readFileSync(path.join(packageDir, 'package.json'), 'utf-8')
);
const version = pkgJson.version;

const outputPath = path.join(packageDir, `${packageName}-${version}.zip`);
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Created zip: ${outputPath} (${archive.pointer()} bytes)`);
});

archive.on('error', err => {
  throw err;
});

archive.pipe(output);
archive.directory(distDir, false);
archive.finalize();
