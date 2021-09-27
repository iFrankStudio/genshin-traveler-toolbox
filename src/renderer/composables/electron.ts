import type Electron from 'electron'
import {
  CancellationToken,
  UpdaterEvents,
  UpdateInfo,
  ProgressInfo,
  UpdateDownloadedEvent
} from 'electron-updater'
import { Update, WindowControl } from '/@shared/ElectronIpcOperations'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { shell, clipboard, ipcRenderer, dialog } = (window as any)
  .electron as typeof Electron

export function useShell() {
  return shell
}

export function useClipboard() {
  return clipboard
}

export function useIpc() {
  return ipcRenderer
}

export function useDialog() {
  return dialog
}

export function useBrowserWindowOperation() {
  const ipc = useIpc()

  const show = () => ipc.invoke('control', WindowControl.Show)
  const hide = () => ipc.invoke('control', WindowControl.Hide)
  const minimize = () => ipc.invoke('control', WindowControl.Minimize)
  const maximize = () => ipc.invoke('control', WindowControl.Maximize)
  const close = () => ipc.invoke('control', WindowControl.Close)
  const quit = () => ipc.invoke('control', WindowControl.Quit)

  return {
    minimize,
    maximize,
    show,
    hide,
    close,
    quit
  }
}

export function useUpdater(handler: {
  onDownloadProgress?: (info: ProgressInfo) => void
  onCheckingForUpdate?: () => void
  onUpdateAvailable?: (info: UpdateInfo) => void
  onUpdateNotAvailable?: (info: UpdateInfo) => void
  onUpdateDownloaded?: (info: UpdateDownloadedEvent) => void
  onUpdateCancelled?: (info: UpdateInfo) => void
  onError?: (error: Error) => void
}) {
  const ipc = useIpc()

  ipc.on(
    'update',
    (
      event,
      data: {
        message: UpdaterEvents | 'update-not-available'
        info?: UpdateInfo | ProgressInfo | UpdateDownloadedEvent
        error?: Error
      }
    ) => {
      switch (data.message) {
        case 'download-progress':
          handler.onDownloadProgress?.call(window, data.info as ProgressInfo)
          break
        case 'checking-for-update':
          handler.onCheckingForUpdate?.call(window)
          break
        case 'update-not-available':
          handler.onUpdateNotAvailable?.call(window, data.info as UpdateInfo)
          break
        case 'update-available':
          handler.onUpdateAvailable?.call(window, data.info as UpdateInfo)
          break
        case 'update-downloaded':
          handler.onUpdateDownloaded?.call(
            window,
            data.info as UpdateDownloadedEvent
          )
          break
        case 'update-cancelled':
          handler.onUpdateCancelled?.call(window, data.info as UpdateInfo)
          break
        case 'error':
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          handler.onError?.call(window, data.error!)
      }
    }
  )

  const check = (notify = false) => ipc.invoke('update', Update.Check, notify)
  const download = () => ipc.invoke('update', Update.Download)
  const resume = (cancellationToken?: CancellationToken) =>
    ipc.invoke('update', Update.Resume, cancellationToken)
  const cancel = (cancellationToken: CancellationToken) =>
    ipc.invoke('update', Update.Cancel, cancellationToken)
  const install = () => ipc.invoke('update', Update.Install)

  return { check, download, resume, cancel, install }
}
