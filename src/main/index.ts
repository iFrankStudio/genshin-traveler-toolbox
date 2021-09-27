import { app, BrowserWindow } from 'electron'
import './electron/all'
import { UpdateHandler } from './electron/update'
import { Logger } from './logger'
import { initialize } from './services'
import { appId } from './utils'
import indexPreload from '/@preload/index'
import indexHtmlUrl from '/@renderer/index.html'
import logoUrl from '/@static/logo.png'

async function main() {
  const logger = new Logger()
  logger.initialize(app.getPath('userData'))
  initialize(logger)
  app.setAppUserModelId(appId)
  app.whenReady().then(() => {
    createWindow()
    // const [x, y] = main.getPosition()
    // const side = createSecondWindow()
    // side.setPosition(x + 800 + 5, y)
  })
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 633,
    width: 1024,
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
  mainWindow.loadURL(indexHtmlUrl).then(() => {
    new UpdateHandler(mainWindow).initAutoUpdater()
  })
  return mainWindow
}

// ensure app start as single instance
if (!app.requestSingleInstanceLock()) {
  app.quit()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.nextTick(main)
