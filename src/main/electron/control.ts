import { app, BrowserWindow, ipcMain } from 'electron'
import { WindowControl } from '../../shared/ElectronIpcOperations'

ipcMain.handle('control', (event, operation: WindowControl) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window) {
    switch (operation) {
      case WindowControl.Maximize:
        if (window.maximizable) {
          window.maximize()
          return true
        }
        return false
      case WindowControl.Minimize:
        if (window.minimizable) {
          window.minimize()
          return true
        }
        return false
      case WindowControl.Hide:
        if (window.isVisible()) {
          window.hide()
          return true
        }
        return false
      case WindowControl.Show:
        if (!window.isVisible()) {
          window.show()
          return true
        }
        return false
      case WindowControl.Close:
        window.close()
        if (BrowserWindow.getAllWindows().length === 0) {
          app.quit()
        }
        return true
      case WindowControl.Quit:
        app.quit()
        return true
    }
  }
  return false
})
