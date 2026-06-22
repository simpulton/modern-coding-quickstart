//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/docs/technologies/react/next/Guides/next-config-setup
  nx: {},
  // PGLite loads a WASM runtime from disk; keep it out of the server bundle so
  // Node resolves the package (and its .wasm) natively rather than via webpack.
  serverExternalPackages: ['@electric-sql/pglite'],
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
