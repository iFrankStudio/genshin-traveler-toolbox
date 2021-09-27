const baseConfig = require('./build.base.config')

/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  ...baseConfig,
  nsis: {
    // eslint-disable-next-line no-template-curly-in-string
    artifactName: '${name}-${channel}-setup.${ext}',
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    perMachine: true,
    differentialPackage: true
  },
  // dmg: {
  //   contents: [
  //     {
  //       x: 410,
  //       y: 150,
  //       type: 'link',
  //       path: '/Applications'
  //     },
  //     {
  //       x: 130,
  //       y: 150,
  //       type: 'file'
  //     }
  //   ]
  // },
  // mac: {
  //   icon: 'static/icons/icon.icns',
  //   target: [
  //     {
  //       target: 'zip'
  //     },
  //     {
  //       target: 'dmg'
  //     }
  //   ]
  // },
  win: {
    icon: 'static/icons/icon.ico',
    target: [
      // disable build for x32 by default
      // 'nsis:ia32',
      'nsis:x64',
      // uncomment to generate web installer
      // electron-builder can use either web or offline installer to auto update
      // {
      //   target: 'nsis-web',
      //   arch: [
      //     'x64',
      //   ]
      // },
      {
        target: 'zip',
        arch: ['x64']
      }
    ]
  },
  // linux: {
  //   icon: 'static/icons',
  //   target: [
  //     {
  //       target: 'deb'
  //     },
  //     {
  //       target: 'rpm'
  //     },
  //     {
  //       target: 'AppImage'
  //     },
  //     {
  //       target: 'snap'
  //     }
  //   ]
  // },
  snap: {
    publish: ['github']
  }
}

module.exports = config
