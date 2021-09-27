import { BrowserWindow, ipcMain } from 'electron'
import {
  autoUpdater,
  CancellationToken,
  ProgressInfo,
  UpdateDownloadedEvent,
  UpdateInfo
} from 'electron-updater'
import debugLogger from 'electron-log'
import { Update } from '/@shared/ElectronIpcOperations'
import { isDebug, isDev } from '../utils'

function setupAutoUpdater() {
  autoUpdater.logger = debugLogger
  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.allowPrerelease = isDev || isDebug
  autoUpdater.channel = process.env.UPDATE_CHANNEL || 'latest' // 'alpha' | 'beta' | 'latest'
}

setupAutoUpdater()

ipcMain.handle(
  'update',
  (event, operation: Update, arg?: boolean | CancellationToken) => {
    switch (operation) {
      case Update.Check:
        arg
          ? autoUpdater.checkForUpdatesAndNotify({
              title: '有新的版本啦',
              body: `旅行者，新版本 v{version} 准备好了，可以更新了哦~`
            })
          : autoUpdater.checkForUpdates()
        break
      case Update.Download:
      case Update.Resume:
        autoUpdater.downloadUpdate(
          arg instanceof CancellationToken ? arg : new CancellationToken()
        )
        break
      case Update.Cancel:
        arg instanceof CancellationToken && arg.cancel()
        break
      case Update.Install:
        autoUpdater.quitAndInstall(true, true)
        break
      default:
        throw Error('Illegal operation has been called on update.')
    }
  }
)

export class UpdateHandler {
  window: BrowserWindow

  constructor(window: BrowserWindow) {
    this.window = window
  }

  initAutoUpdater() {
    autoUpdater.on('error', this.onError)
    autoUpdater.on('checking-for-update', this.onCheckingForUpdate)
    autoUpdater.on('update-available', this.onUpdateAvailable)
    autoUpdater.on('update-not-available', this.onUpdateNotAvailable)
    autoUpdater.signals.progress(this.onProgress)
    autoUpdater.signals.updateDownloaded(this.onUpdateDownloaded)
    autoUpdater.signals.updateCancelled(this.onUpdateCancelled)

    this.window.on('closed', () => {
      autoUpdater.removeListener('error', this.onError)
      autoUpdater.removeListener(
        'checking-for-update',
        this.onCheckingForUpdate
      )
      autoUpdater.removeListener('update-available', this.onUpdateAvailable)
      autoUpdater.removeListener(
        'update-not-available',
        this.onUpdateNotAvailable
      )
      autoUpdater.removeListener('download-progress', this.onProgress)
      autoUpdater.removeListener('update-downloaded', this.onUpdateDownloaded)
      autoUpdater.removeListener('update-cancelled', this.onUpdateCancelled)
    })
  }

  private onError = (error: Error) => {
    this.window.webContents.send('update', { message: 'error', error })
  }
  private onCheckingForUpdate = () => {
    this.window.webContents.send('update', {
      message: 'checking-for-update'
    })
  }
  private onUpdateAvailable = (info: UpdateInfo) => {
    this.window.webContents.send('update', {
      message: 'update-available',
      info
    })
  }
  private onUpdateNotAvailable = (info: UpdateInfo) => {
    this.window.webContents.send('update', {
      message: 'update-not-available',
      info
    })
  }
  private onProgress = (info: ProgressInfo) => {
    this.window.webContents.send('update', {
      message: 'download-progress',
      info
    })
  }
  private onUpdateDownloaded = (info: UpdateDownloadedEvent) => {
    this.window.webContents.send('update', {
      message: 'update-downloaded',
      info
    })
  }
  private onUpdateCancelled = (info: UpdateInfo) => {
    this.window.webContents.send('update', {
      message: 'update-cancelled',
      info
    })
  }
}
