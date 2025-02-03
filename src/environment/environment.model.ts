const environmentNames = {
  local: 'Local devving setup',
  prod: 'Production setup for hosting',
} as const

export type IEnvironmentName = keyof typeof environmentNames

export interface IEnvironment {
  environmentName: IEnvironmentName
  backendUrl: string
  websocketUrl: string
}
