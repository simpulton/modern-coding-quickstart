const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  // PGLite loads its WASM via dynamic import(); integration suites run under
  // NODE_OPTIONS=--experimental-vm-modules (see each lib's test target).
  setupFiles: ['reflect-metadata'],
};
