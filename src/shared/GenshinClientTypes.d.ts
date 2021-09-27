export type ClientType = '原神' | 'GenshinImpact' // 国服/其他服

export interface RegistryValue {
  type: string
  value: string
}

export interface GenshinRegistry {
  UUID: RegistryValue
  DisplayIcon: RegistryValue
  DisplayName: RegistryValue
  DisplayVersion: RegistryValue
  Publisher: RegistryValue
  UninstallString: RegistryValue
  InstallPath: RegistryValue
  ExeName: RegistryValue
  URLInfoAbout: RegistryValue
  EstimatedSize: RegistryValue
}

export interface LauncherConfig {
  cps: string
  channel: number
  sub_channel: number
  game_install_path: string
  game_dynamic_bg_name: string
  game_dynamic_bg_md5: string
  game_start_name: string
  is_first_exit: boolean
  exit_type: number
  speed_limit_enabled: boolean
}

export interface GameConfig {
  channel: number
  cps: string
  game_version: string
  sub_channel: number
  sdk_version: string
}

export interface ClientInfo<ConfigType extends LauncherConfig | GameConfig> {
  version: string
  installPath: string
  exePath: string
  config: ConfigType
  configPath: string
}

export interface GenshinClient {
  type: ClientType
  registry: GenshinRegistry
  launcher: ClientInfo<LauncherConfig>
  game: ClientInfo<GameConfig>
}
