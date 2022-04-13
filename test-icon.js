const { execSync } = require('child_process');
const path = require('path');
const plist = require('simple-plist');
const fs = require('fs');
const tempy = require('tempy');

const app = process.argv[2];
console.log(app);

const plistFile = path.join(app, 'Contents', 'Info.plist');
const parsed = plist.readFileSync(plistFile);
// console.log(JSON.stringify(parsed));
console.log('CFBundleIconFile:');
const icon = parsed['CFBundleIconFile'];

const icnsFile = path.join(app, 'Contents', 'Resources', `${icon}.icns`);
console.log(icnsFile);

const output = path.join(tempy.directory(), `${icon}.iconset`);

execSync(`iconutil --convert iconset ${icnsFile} --output ${output}`);

const pngs = fs
  .readdirSync(output)
  .map((f) => path.join(output, f))
  .map((png) => ({ file: png, size: fs.statSync(png).size }))
  .sort((a, b) => b.size - a.size);
console.log(pngs[0].file);
const b = fs.readFileSync(pngs[0].file, 'base64');
console.log(b);
