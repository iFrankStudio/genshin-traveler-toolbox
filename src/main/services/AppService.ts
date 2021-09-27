import { app, BrowserWindow } from 'electron'
import { platform } from 'os'
import { isDev } from '/@main/utils'
import { Service } from './Service'
import path from 'path'
import { homepage, version } from '../../../package.json'
import indexPreload from '/@preload/index'
import aboutHtmlUrl from '/@renderer/about.html'
import logoUrl from '/@static/logo.png'
import { UpdateHandler } from '../electron/update'

export class AppService extends Service {
  private aboutWindow: BrowserWindow | null = null

  async getBasicInformation() {
    return {
      platform: platform(),
      version: isDev ? version : app.getVersion(),
      root: app.getPath('userData'),
      homepage
    }
  }

  async getPublicPath(_path = '') {
    const base = isDev ? '/' : path.join(app.getAppPath(), 'renderer')
    return path.join(base, _path)
  }

  createAboutWindow() {
    if (this.aboutWindow) {
      this.aboutWindow.show()
      return
    }
    this.aboutWindow = new BrowserWindow({
      width: 648,
      height: 400,
      webPreferences: {
        preload: indexPreload,
        contextIsolation: true,
        nodeIntegration: false
      },
      icon: logoUrl,
      frame: false,
      resizable: false,
      maximizable: false
    })
    this.aboutWindow.once('close', () => {
      this.aboutWindow = null
    })
    this.aboutWindow.loadURL(aboutHtmlUrl).then(() => {
      if (this.aboutWindow)
        new UpdateHandler(this.aboutWindow).initAutoUpdater()
    })
  }
}
