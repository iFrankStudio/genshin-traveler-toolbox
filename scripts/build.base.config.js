const packageRoot = require('../package.json')
/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  productName: process.env.APP_NAME || packageRoot.name,
  appId: packageRoot.build.appId,
  electronVersion: process.env.ELECTRON_VERSION, // only used for development debugging
  directories: {
    output: 'build',
    buildResources: 'build',
    app: 'dist'
  },
  // assign publish for auto-updater
  // set this to your own repo!
  publish: [
    {
      provider: 'github',
      owner: 'iFrankStudio',
      repo: 'genshin-traveler-toolbox'
    }
  ],
  files: [
    // don't include node_modules as all js modules are bundled into production js by rollup
    // unless you want to prevent some module to bundle up
    // list them below
  ]
}

module.exports = config
