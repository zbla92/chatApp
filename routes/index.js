/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const path = require('path');

const baseName = path.basename(module.filename);

const routes = fs
  .readdirSync(path.join(__dirname))
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== baseName && file.slice(-3) === '.js'
  )
  .map((file) => require(path.join(__dirname, file)));

module.exports = (app) => {
  for (const router of routes) {
    app.use(router.routes());
  }
};
