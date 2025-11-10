const fs = require('fs');
const path = require('path');
const packageJsonPath = path.join(__dirname, 'package.json');
const manifestJsonPath = path.join(__dirname, '..', 'backend', 'updates', 'manifest.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const manifestJson = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf-8'));

manifestJson.version = packageJson.version;

fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 2));

console.log(`Successfully updated manifest.json to version ${packageJson.version}`);
