import { IEnvironment } from './environment.model'

const baseBackendUrl = 'glass-awesome-wanderer.glitch.me'

export const prodEnv: IEnvironment = {
  environmentName: 'prod',
  backendUrl: `https://${baseBackendUrl}`,
  websocketUrl: `wss://${baseBackendUrl}`,
}
