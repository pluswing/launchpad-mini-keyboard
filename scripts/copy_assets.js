const fse = require('fs-extra');
const path = require('path');

const root = path.dirname(__dirname);

fse.copySync(
  path.join(root, 'src', 'assets'),
  path.join(root, 'dist', 'assets')
);
