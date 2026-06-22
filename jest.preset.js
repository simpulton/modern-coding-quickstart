const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  // PGLite loads its WASM via dynamic import(); integration suites run under
  // NODE_OPTIONS=--experimental-vm-modules (see each lib's test target).
  setupFiles: ['reflect-metadata'],
  // The tRPC libs are exercised by the cross-layer integration suite in
  // @pm/shared-testing rather than by colocated unit tests.
  passWithNoTests: true,
};
