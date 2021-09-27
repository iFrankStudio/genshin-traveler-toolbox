import { Service } from './Service'
import {
  ClientInfo,
  ClientType,
  GameConfig,
  GenshinClient,
  GenshinRegistry,
  LauncherConfig
} from '/@shared/GenshinClientTypes'
import { readConfigFile, useRegedit } from '/@main/utils'
import path from 'path'
import { promises as fs } from 'fs-extra'
import SingleTaskQueue from '/@main/lib/SingleTaskQueue'
import sudo from 'sudo-prompt'

enum GenshinRegPath {
  原神 = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\原神',
  GenshinImpact = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Genshin Impact'
}

export class GenshinClientService extends Service {
  private clients: GenshinClient[] = []
  private loaded = false

  private getClientsTasksQueue = new SingleTaskQueue<GenshinClient[]>(3000)

  async getGenshinClientInstalled(reload = false): Promise<GenshinClient[]> {
    const worker = () => this.loadClients(reload)
    return this.getClientsTasksQueue.newTask(worker)
  }

  async loadClients(reload = false): Promise<GenshinClient[]> {
    if (this.loaded && !reload) {
      return this.clients
    }

    this.clients = []
    const registries = await this.getRegistries()

    for (const [clientType, registry] of registries) {
      const launcherConfig: LauncherConfig = await this.getLauncherConfig(
        registry.InstallPath.value
      )
      const launcher: ClientInfo<LauncherConfig> = {
        version: registry.DisplayVersion.value,
        installPath: registry.InstallPath.value,
        exePath: path.join(registry.InstallPath.value, 'launcher.exe'),
        config: launcherConfig,
        configPath: path.join(registry.InstallPath.value, 'config.ini')
      }

      const gameConfig: GameConfig = await this.getGameConfig(
        launcherConfig.game_install_path
      )
      const game: ClientInfo<GameConfig> = {
        version: gameConfig.game_version,
        installPath: launcherConfig.game_install_path,
        exePath: path.join(
          launcherConfig.game_install_path,
          clientType === '原神' ? 'YuanShen.exe' : 'GenshinImpact.exe'
        ),
        config: gameConfig,
        configPath: path.join(launcherConfig.game_install_path, 'config.ini')
      }

      const client: GenshinClient = {
        type: clientType,
        registry,
        launcher,
        game
      }
      this.clients.push(client)
    }

    this.clients.sort((a, b) => (a.game.version > b.game.version ? -1 : 1))

    this.loaded = true
    return this.clients
  }

  async runClient(clientPath: string) {
    return new Promise((resolve, reject) => {
      sudo.exec(`"${clientPath}"`, (error, stdout, stderr) => {
        if (error) {
          reject(error)
        }
        this.log(stderr)
        resolve([stdout, stderr])
      })
    })
  }

  private async getRegistries(): Promise<Map<ClientType, GenshinRegistry>> {
    const data = new Map<ClientType, GenshinRegistry>()

    try {
      const registryList = await useRegedit.promisified.list<GenshinRegPath>([
        GenshinRegPath.原神,
        GenshinRegPath.GenshinImpact
      ])
      if (registryList[GenshinRegPath.原神].exists)
        data.set(
          '原神',
          registryList[GenshinRegPath.原神].values as unknown as GenshinRegistry
        )
      if (registryList[GenshinRegPath.GenshinImpact].exists)
        data.set(
          'GenshinImpact',
          registryList[GenshinRegPath.GenshinImpact]
            .values as unknown as GenshinRegistry
        )
    } catch (e) {
      this.log(e)
      throw e
    }

    return data
  }

  private async getLauncherConfig(
    launcherInstallPath: string
  ): Promise<LauncherConfig> {
    const { launcher } = await readConfigFile<{ launcher: LauncherConfig }>(
      path.join(launcherInstallPath, 'config.ini')
    )
    return launcher
  }

  private async getGameConfig(gameInstallPath: string): Promise<GameConfig> {
    const { General } = await readConfigFile<{ General: GameConfig }>(
      path.join(gameInstallPath, 'config.ini')
    )
    return General
  }

  async getLauncherBgInBase64(
    launcherInstallPath: string,
    bgName: string
  ): Promise<string> {
    const bgPath = path.join(launcherInstallPath, 'bg', bgName)
    // const arrayBufferView = new Uint8Array(await fs.readFile(bgPath))
    // return new Blob([arrayBufferView], { type: 'image/png' })
    return fs.readFile(bgPath, { encoding: 'base64' })
  }
}
