#!/usr/bin/env node

/**
 * Version Bump Script
 * 
 * Automatically bumps version numbers in package.json files
 * Usage: node scripts/version-bump.js [major|minor|patch]
 */

const fs = require('fs');
const path = require('path');

const VERSION_TYPES = ['major', 'minor', 'patch'];

function getCurrentVersion() {
  const packagePath = path.join(__dirname, '../apps/api/package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  return pkg.version;
}

function bumpVersion(version, type) {
  const parts = version.split('.').map(Number);
  let [major, minor, patch] = parts;

  switch (type) {
    case 'major':
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor += 1;
      patch = 0;
      break;
    case 'patch':
      patch += 1;
      break;
    default:
      throw new Error(`Invalid version type: ${type}`);
  }

  return `${major}.${minor}.${patch}`;
}

function updatePackageJson(filePath, newVersion) {
  const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  pkg.version = newVersion;
  fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`✅ Updated ${filePath} to version ${newVersion}`);
}

function main() {
  const versionType = process.argv[2];

  if (!versionType || !VERSION_TYPES.includes(versionType)) {
    console.error(`Usage: node scripts/version-bump.js [${VERSION_TYPES.join('|')}]`);
    process.exit(1);
  }

  const currentVersion = getCurrentVersion();
  const newVersion = bumpVersion(currentVersion, versionType);

  console.log(`Bumping version from ${currentVersion} to ${newVersion} (${versionType})`);

  // Update all package.json files
  const packageFiles = [
    path.join(__dirname, '../apps/api/package.json'),
    path.join(__dirname, '../apps/portal/package.json'),
    path.join(__dirname, '../package.json'),
  ];

  packageFiles.forEach(file => {
    if (fs.existsSync(file)) {
      updatePackageJson(file, newVersion);
    }
  });

  console.log(`\n✅ Version bumped successfully to ${newVersion}`);
  console.log(`\nNext steps:`);
  console.log(`1. Review the changes`);
  console.log(`2. Commit: git add . && git commit -m "chore: bump version to ${newVersion}"`);
  console.log(`3. Create tag: git tag -a "v${newVersion}" -m "Release v${newVersion}"`);
  console.log(`4. Push: git push origin main && git push origin "v${newVersion}"`);
}

main();

